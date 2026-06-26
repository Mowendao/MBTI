import { TestResult } from '@/types/mbti';
import { getMBTIDescription } from '@/utils/mbti';
import { generatePersonalityReport } from '@/utils/personalityAnalysis';
import { getCareerRecommendations } from '@/utils/careerRecommendation';
import type { LiuYaoResult } from '@/utils/liuyao';
import { generateLiuYaoAnalysis } from '@/utils/liuyao';

/** 生成 MBTI 分享报告 HTML */
export function generateMBTIReport(result: TestResult): string {
  const { type, percentage } = result;
  const description = getMBTIDescription(type);
  const report = generatePersonalityReport(result);
  const careers = getCareerRecommendations(type);

  const dims = [
    { label: '外向(E) / 内向(I)', left: 'E', right: 'I', lp: percentage.E, rp: percentage.I },
    { label: '感觉(S) / 直觉(N)', left: 'S', right: 'N', lp: percentage.S, rp: percentage.N },
    { label: '思考(T) / 情感(F)', left: 'T', right: 'F', lp: percentage.T, rp: percentage.F },
    { label: '判断(J) / 感知(P)', left: 'J', right: 'P', lp: percentage.J, rp: percentage.P },
  ];

  const dimBars = dims.map(d => `
    <div class="dim-row">
      <div class="dim-label">${d.label}</div>
      <div class="dim-bar">
        <div class="dim-fill-left" style="width:${d.lp}%">${d.left} ${d.lp}%</div>
        <div class="dim-fill-right" style="width:${d.rp}%">${d.right} ${d.rp}%</div>
      </div>
    </div>`).join('');

  const insightCards = [
    report.strengths, report.weaknesses, report.learningStyle,
    report.careerFit, report.relationshipStyle,
  ].map(s => `
    <div class="card">
      <h3>${s.title}</h3>
      <p>${s.description}</p>
      <ul>${s.tips.map(t => `<li>${t}</li>`).join('')}</ul>
    </div>`).join('');

  const careerList = careers.slice(0, 5).map(c => `<li><strong>${c.name}</strong> — ${c.description}</li>`).join('');

  return buildHTML('MBTI 性格测试报告', `
    <div class="hero">
      <h1>${type}</h1>
      <p class="desc">${description}</p>
      <p class="date">测试日期：${new Date(result.date).toLocaleDateString('zh-CN')}</p>
    </div>
    <section>
      <h2>📊 性格维度</h2>
      ${dimBars}
    </section>
    <section>
      <h2>🔍 性格分析</h2>
      <div class="cards-grid">${insightCards}</div>
    </section>
    <section>
      <h2>🎯 推荐职业</h2>
      <ul class="career-list">${careerList}</ul>
    </section>
  `);
}

/** 生成六爻分享报告 HTML */
export function generateLiuYaoReport(result: LiuYaoResult): string {
  const { originalHexagram, changedHexagram, mbtiType, yaos } = result;
  const analysis = generateLiuYaoAnalysis(result);

  const yaoRows = [...yaos].reverse().map(y => {
    const labels: Record<string, string> = {
      old_yang: '老阳 ○', young_yang: '少阳 —',
      young_yin: '少阴 - -', old_yin: '老阴 X',
    };
    const dims: Record<string, string> = {
      EI: '精力态度', SN: '认知方式', TF: '决策方式', JP: '生活态度',
    };
    return `<tr class="${y.isChanging ? 'changing' : ''}">
      <td>第${y.index}爻</td>
      <td>${labels[y.type]}</td>
      <td>${dims[y.dimension] || y.dimension}</td>
      <td>${y.isYang ? '阳' : '阴'}${y.isChanging ? '（动）' : ''}</td>
    </tr>`;
  }).join('');

  const analysisHtml = analysis.map(a => `<p>${a}</p>`).join('');

  return buildHTML('易经性格测试报告', `
    <div class="hero">
      <h1>🔮 ${originalHexagram.name}${changedHexagram ? ' → ' + changedHexagram.name : ''}</h1>
      <p class="desc">${originalHexagram.meaning}</p>
    </div>
    <section>
      <h2>📜 卦象信息</h2>
      <div class="cards-grid">
        <div class="card">
          <h3>本卦 · ${originalHexagram.name}</h3>
          <p>${originalHexagram.meaning}</p>
          <p><em>${originalHexagram.advice}</em></p>
        </div>
        ${changedHexagram ? `<div class="card">
          <h3>变卦 · ${changedHexagram.name}</h3>
          <p>${changedHexagram.meaning}</p>
          <p><em>${changedHexagram.advice}</em></p>
        </div>` : ''}
      </div>
    </section>
    <section>
      <h2>📊 六爻详情</h2>
      <table class="data-tbl">
        <thead><tr><th>位置</th><th>类型</th><th>维度</th><th>属性</th></tr></thead>
        <tbody>${yaoRows}</tbody>
      </table>
    </section>
    <section>
      <h2>🧩 推演 MBTI：${mbtiType}</h2>
      ${analysisHtml}
    </section>
  `);
}

/** 触发浏览器下载 HTML 文件 */
export function downloadReport(html: string, filename: string) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ---- 内部工具 ----

function buildHTML(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<title>${title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans SC",sans-serif;color:#333;background:#f5f5f5;line-height:1.7}
.wrap{max-width:800px;margin:0 auto;padding:2rem}
.hero{text-align:center;padding:3rem 2rem;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border-radius:12px;margin-bottom:2rem}
.hero h1{font-size:3rem;margin-bottom:.5rem}
.hero .desc{font-size:1.1rem;opacity:.9}
.hero .date{font-size:.85rem;opacity:.6;margin-top:.75rem}
section{background:#fff;border-radius:10px;padding:2rem;margin-bottom:1.5rem;box-shadow:0 2px 12px rgba(0,0,0,.05)}
section h2{margin-bottom:1.25rem;color:#333;font-size:1.3rem}
.dim-row{margin-bottom:1rem}
.dim-label{font-size:.9rem;margin-bottom:.35rem;color:#555}
.dim-bar{display:flex;height:32px;border-radius:16px;overflow:hidden;background:#eee}
.dim-fill-left{display:flex;align-items:center;justify-content:center;background:#667eea;color:#fff;font-size:.78rem;font-weight:600}
.dim-fill-right{display:flex;align-items:center;justify-content:center;background:#764ba2;color:#fff;font-size:.78rem;font-weight:600}
.cards-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem}
.card{background:#fafafa;border-radius:8px;padding:1.25rem;border:1px solid #eee}
.card h3{color:#667eea;margin-bottom:.5rem;font-size:1.05rem}
.card p{color:#666;margin-bottom:.5rem;font-size:.92rem}
.card ul{padding-left:1.25rem;color:#666;font-size:.9rem}
.card ul li{margin-bottom:.3rem}
.career-list{padding-left:1.5rem;color:#555}
.career-list li{margin-bottom:.75rem}
.data-tbl{width:100%;border-collapse:collapse}
.data-tbl th,.data-tbl td{padding:.6rem .8rem;border-bottom:1px solid #eee;text-align:left;font-size:.9rem}
.data-tbl th{background:#f8f8f8;font-weight:600}
tr.changing{background:#fff8e1}
.print-btn{display:block;margin:2rem auto 0;padding:.75rem 2rem;border:none;border-radius:8px;background:#667eea;color:#fff;font-size:1rem;cursor:pointer}
.print-btn:hover{background:#764ba2}
@media print{.print-btn{display:none}body{background:#fff}.wrap{padding:0}section{box-shadow:none;border:1px solid #ddd}}
</style>
</head>
<body>
<div class="wrap">
${body}
<button class="print-btn" onclick="window.print()">🖨️ 打印 / 保存PDF</button>
</div>
</body>
</html>`;
}
