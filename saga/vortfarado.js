/* ============================================================
   vortfarado.js — 世界语构词引擎
   三件事：拆词（analyze）、造词（build）、变形（conjugate）
   依赖 lexikon.js 里的 LEXIKON
   ============================================================ */
(function (root) {
  'use strict';

  var L = (typeof LEXIKON !== 'undefined') ? LEXIKON : root.LEXIKON;
  if (!L) throw new Error('vortfarado.js 需要先加载 lexikon.js');

  var EO_ALPHABET = /^[abcĉdefgĝhĥijĵklmnoprsŝtuŭvz]+$/;
  var MAX_PREFIX_DEPTH = 2;
  var MAX_CANDIDATES = 40;

  /* ---------- 索引 ---------- */

  // 词尾按长度倒序，最长匹配优先
  var ENDINGS = Object.keys(L.fin).sort(function (a, b) { return b.length - a.length; });

  // 切分单元表
  var UNITS = [];
  Object.keys(L.pre).forEach(function (k) {
    UNITS.push({ text: k, kind: 'pre', cls: null, zh: L.pre[k].zh, key: k });
  });
  Object.keys(L.suf).forEach(function (k) {
    UNITS.push({ text: k, kind: 'suf', cls: L.suf[k].to === 'same' ? null : L.suf[k].to, zh: L.suf[k].zh, key: k });
  });
  Object.keys(L.roots).forEach(function (k) {
    UNITS.push({ text: k, kind: 'root', cls: L.roots[k][1], zh: L.roots[k][0], key: k });
  });

  // 按首字母分组，避免每个位置都全表扫描
  var BY_FIRST = {};
  UNITS.forEach(function (u) {
    var c = u.text[0];
    (BY_FIRST[c] = BY_FIRST[c] || []).push(u);
  });
  Object.keys(BY_FIRST).forEach(function (c) {
    BY_FIRST[c].sort(function (a, b) { return b.text.length - a.text.length; });
  });

  var WHOLE = {};
  L.whole.forEach(function (w) { WHOLE[w] = true; });

  /* ---------- 工具 ---------- */

  function normalize(w) {
    return String(w == null ? '' : w).trim().toLowerCase();
  }

  function finKeyOf(pos, num, cas) {
    if (pos === 'n') return cas === 'acc' ? (num === 'pl' ? 'ojn' : 'on') : (num === 'pl' ? 'oj' : 'o');
    if (pos === 'adj') return (num === 'pl' ? 'aj' : 'a') + (cas === 'acc' ? 'n' : '');
    if (pos === 'adv') return 'e';
    if (pos === 'inf') return 'i';
    return null; // 动词时态由 ending 直接指定
  }

  // 剥词尾：返回 { head, ending }
  function splitEnding(word) {
    for (var i = 0; i < ENDINGS.length; i++) {
      var e = ENDINGS[i];
      if (word.length > e.length && word.slice(-e.length) === e) {
        return { head: word.slice(0, word.length - e.length), ending: e };
      }
    }
    return { head: word, ending: null };
  }

  /* ---------- 拆词 ---------- */

  // 从 core 开头剥离 0~MAX_PREFIX_DEPTH 个前缀，返回若干 { pres, rest }
  function peelPrefixes(core) {
    var out = [];
    (function go(i, acc, depth) {
      out.push({ pres: acc.slice(), rest: core.slice(i) });
      if (depth >= MAX_PREFIX_DEPTH) return;
      Object.keys(L.pre).forEach(function (p) {
        if (core.slice(i, i + p.length) === p && core.length > i + p.length) {
          acc.push(p);
          go(i + p.length, acc, depth + 1);
          acc.pop();
        }
      });
    })(0, [], 0);
    return out;
  }

  // 对不含前缀的剩余串做 DP 切分，只允许 root / suf
  function segmentCore(core, budget) {
    var n = core.length;
    if (n === 0) return [];
    var memo = {};
    var count = { n: 0 };

    function go(i) {
      if (i === n) return [[]];
      if (memo[i]) return memo[i];
      var out = [];
      var cands = BY_FIRST[core[i]] || [];
      for (var k = 0; k < cands.length && out.length < budget; k++) {
        var u = cands[k];
        if (u.kind === 'pre') continue;                 // 前缀不在词身内部出现
        if (u.text !== core.substr(i, u.text.length)) continue;
        if (i === 0 && u.kind === 'suf') continue;       // 词身不能以后缀开头
        var rest = go(i + u.text.length);
        for (var r = 0; r < rest.length && out.length < budget; r++) {
          out.push([u].concat(rest[r]));
          count.n++;
          if (count.n > 400) return out;                 // 硬上限，防指数爆炸
        }
      }
      memo[i] = out;
      return out;
    }

    return go(0);
  }

  // 计算一个切分方案的最终语义类别与代价
  function scoreParts(parts) {
    var cls = null;
    var rootCount = 0;
    var suffixCount = 0;
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (p.kind === 'root') {
        rootCount++;
        cls = p.cls;
      } else if (p.kind === 'suf') {
        suffixCount++;
        var meta = L.suf[p.key];
        if (meta.to !== 'same') cls = meta.to;
      }
    }
    // 代价：切分段数 —— 段数越少越可能是正确切分
    var cost = parts.length + rootCount * 0.01 - suffixCount * 0.01;
    return { cls: cls, rootCount: rootCount, suffixCount: suffixCount, cost: cost };
  }

  function glossOf(parts, ending) {
    var bits = parts.map(function (p) { return p.zh; });
    if (ending) bits.push(L.fin[ending.key] ? L.fin[ending.key].zh : ending.key);
    return bits;
  }

  /**
   * 分析一个世界语词
   * @returns {{ok:boolean, word:string, whole:boolean, ending:object|null, candidates:Array, error?:string}}
   */
  function analyze(input) {
    var word = normalize(input);
    var res = { ok: false, word: word, whole: false, ending: null, candidates: [] };

    if (!word) { res.error = '请输入一个世界语词'; return res; }
    if (!EO_ALPHABET.test(word)) {
      var bad = word.split('').filter(function (ch) { return !/[abcĉdefgĝhĥijĵklmnoprsŝtuŭvz]/.test(ch); });
      res.error = '含非世界语字母：' + bad.join(' ') + '（世界语不用 q w x y）';
      return res;
    }

    // 整词白名单
    if (WHOLE[word]) {
      res.ok = true;
      res.whole = true;
      res.candidates = [{
        parts: [{ text: word, kind: 'whole', zh: '基础词（整词记忆）', cls: null }],
        ending: null,
        cls: null,
        gloss: ['基础词，不作机械切分'],
        cost: 0
      }];
      return res;
    }

    var sp = splitEnding(word);
    var ending = sp.ending ? { key: sp.ending, meta: L.fin[sp.ending] } : null;
    res.ending = ending;

    var all = [];
    var peels = peelPrefixes(sp.head);
    for (var i = 0; i < peels.length; i++) {
      var peel = peels[i];
      var segs = segmentCore(peel.rest, 6);
      for (var j = 0; j < segs.length; j++) {
        var seg = segs[j];
        if (seg.length === 0) continue;
        var parts = [];
        peel.pres.forEach(function (p) {
          parts.push({ text: p, kind: 'pre', zh: L.pre[p].zh, cls: null, key: p });
        });
        seg.forEach(function (u) {
          parts.push({ text: u.text, kind: u.kind, zh: u.zh, cls: u.cls, key: u.key });
        });
        // 必须至少有一个词根，且不能以词缀收尾（-ist / -il 这类合法后缀除外，见下）
        var hasRoot = parts.some(function (p) { return p.kind === 'root'; });
        if (!hasRoot) continue;
        var sc = scoreParts(parts);
        all.push({
          parts: parts,
          ending: ending,
          cls: sc.cls,
          rootCount: sc.rootCount,
          suffixCount: sc.suffixCount,
          gloss: glossOf(parts, ending),
          cost: sc.cost
        });
      }
    }

    // 去重（同一段文本序列只保留一份）
    var seen = {};
    all = all.filter(function (c) {
      var sig = c.parts.map(function (p) { return p.kind + ':' + p.text; }).join('|');
      if (seen[sig]) return false;
      seen[sig] = true;
      return true;
    });

    all.sort(function (a, b) { return a.cost - b.cost; });
    res.candidates = all.slice(0, MAX_CANDIDATES);
    res.ok = res.candidates.length > 0;
    if (!res.ok) res.error = '词素表里找不到能拼出这个词的组合';
    return res;
  }

  /* ---------- 造词 ---------- */

  /**
   * @param {{pre?:string[], root:string, sufs?:string[], ending:string}} spec
   */
  function build(spec) {
    var pre = spec.pre || [];
    var sufs = spec.sufs || [];
    var ending = spec.ending || 'o';
    var out = { ok: true, errors: [], warnings: [], parts: [], word: '', gloss: [] };

    if (!L.roots[spec.root]) {
      out.ok = false;
      out.errors.push('未知词根：' + spec.root);
      return out;
    }

    var cls = L.roots[spec.root][1];
    var parts = [];

    pre.forEach(function (p) {
      if (!L.pre[p]) { out.ok = false; out.errors.push('未知前缀：' + p); return; }
      parts.push({ text: p, kind: 'pre', zh: L.pre[p].zh });
    });
    parts.push({ text: spec.root, kind: 'root', zh: L.roots[spec.root][0] });

    sufs.forEach(function (s) {
      var meta = L.suf[s];
      if (!meta) { out.ok = false; out.errors.push('未知后缀：' + s); return; }
      if (meta.nick) {
        out.warnings.push('-' + s + '- 会截断词根（' + L.roots[spec.root][0] + ' 变成昵称），本工具不自动生成');
        return;
      }
      if (meta.from.indexOf(cls) === -1) {
        out.ok = false;
        out.errors.push('-' + s + '-（' + meta.zh + '）不能接在 ' + clsName(cls) + ' 类词根「' + L.roots[spec.root][0] + '」后，它要求 ' + meta.from.map(clsName).join(' / '));
        return;
      }
      if (meta.vague) out.warnings.push('-um- 语义不固定，实际含义需查词典');
      parts.push({ text: s, kind: 'suf', zh: meta.zh });
      if (meta.to !== 'same') cls = meta.to;
    });

    var finMeta = L.fin[ending];
    var finText = ending;
    // 词性与语义类别的基本一致性检查
    if (finMeta) {
      if (finMeta.pos === 'v' || finMeta.pos === 'inf') {
        if (cls !== 'ag') {
          out.warnings.push('「' + L.roots[spec.root][0] + '」不是动作类词根，加动词词尾 -' + finText + ' 不自然（世界语习惯先加 -ig- 或 -iĝ- 再变位）');
        }
      }
      parts.push({ text: finText, kind: 'fin', zh: finMeta.zh });
    } else {
      out.ok = false;
      out.errors.push('未知词尾：' + ending);
    }

    out.parts = parts;
    out.word = parts.map(function (p) { return p.text; }).join('');
    out.cls = cls;
    out.gloss = parts.map(function (p) { return p.zh; });
    return out;
  }

  function clsName(c) {
    return ({ ag: '动作', obj: '事物', prop: '性质', liv: '有生命', num: '数词', rel: '指示' })[c] || c;
  }

  /* ---------- 变形 ---------- */

  /**
   * @param {string} input 原词
   * @param {object} op { num?:'pl', cas?:'acc', pos?:'adj'|'n'|'adv', ending?:'n'|'is'|..., addSuf?:'et', addPre?:'mal' }
   */
  function conjugate(input, op) {
    op = op || {};
    var a = analyze(input);
    if (!a.ok) return { ok: false, word: null, reason: a.error || '无法解析' };
    var best = a.candidates[0];
    var stem = best.parts.map(function (p) { return p.text; }).join('');
    var endingMeta = best.ending ? best.ending.meta : null;
    var curFin = best.ending ? best.ending.key : null;
    var notes = [];

    // 加后缀 / 加前缀（先做，作用在词干上）
    if (op.addSuf) {
      var sm = L.suf[op.addSuf];
      if (!sm) return { ok: false, word: null, reason: '未知后缀' };
      if (sm.nick) return { ok: false, word: null, reason: '-' + op.addSuf + '- 会截断词根，不自动生成' };
      if (sm.from.indexOf(best.cls) === -1) {
        return { ok: false, word: null, reason: '-' + op.addSuf + '- 要求 ' + sm.from.map(clsName).join(' / ') + ' 类词根，当前是 ' + clsName(best.cls) };
      }
      stem = stem + op.addSuf;
      if (sm.vague) notes.push('-um- 语义不固定，含义需查词典');
    }
    if (op.addPre) {
      if (!L.pre[op.addPre]) return { ok: false, word: null, reason: '未知前缀' };
      stem = op.addPre + stem;
    }

    // 算新词尾
    var newFin = op.ending || null;
    if (!newFin && (op.num || op.cas || op.pos)) {
      var pos = op.pos || (endingMeta ? endingMeta.pos : null);
      if (!pos) return { ok: false, word: null, reason: '原词没有可识别的词尾，无法判断词性' };
      if (pos === 'v') {
        return { ok: false, word: null, reason: '动词没有性数格变化，请直接指定时态 ending' };
      }
      var num = op.num || (endingMeta && endingMeta.num ? endingMeta.num : 'sg');
      var cas = op.cas || (endingMeta && endingMeta.cas ? endingMeta.cas : 'nom');
      newFin = finKeyOf(pos, num, cas);
      if (!newFin) return { ok: false, word: null, reason: '无法生成词尾' };
    }
    if (!newFin) newFin = curFin;   // 只加词缀时保留原词尾

    if (!L.fin[newFin]) return { ok: false, word: null, reason: '未知词尾：' + newFin };

    // 动词时态校验：语义类别应为 ag
    var finM = L.fin[newFin];
    if ((finM.pos === 'v' || finM.pos === 'inf') && best.cls !== 'ag') {
      notes.push('原词不是动作类词根，加动词词尾不自然');
    }

    var word = stem + newFin;
    return {
      ok: true,
      word: word,
      stem: stem,
      ending: newFin,
      endingZh: finM.zh,
      notes: notes
    };
  }

  /* ---------- 对外 ---------- */

  root.Vortfarado = {
    analyze: analyze,
    build: build,
    conjugate: conjugate,
    clsName: clsName,
    finKeyOf: finKeyOf,
    splitEnding: splitEnding,
    data: L
  };

})(typeof window !== 'undefined' ? window : globalThis);