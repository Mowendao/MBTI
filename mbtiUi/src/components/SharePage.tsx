import { useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import type { MBTIType } from '@/types/mbti';
import { getMBTIDescription } from '@/utils/mbti';
import './SharePage.css';

const DIMENSION_LABELS = [
  { key: 'ei', left: '外向 E', right: '内向 I', lk: 'E', rk: 'I' },
  { key: 'sn', left: '感觉 S', right: '直觉 N', lk: 'S', rk: 'N' },
  { key: 'tf', left: '思考 T', right: '情感 F', lk: 'T', rk: 'F' },
  { key: 'jp', left: '判断 J', right: '感知 P', lk: 'J', rk: 'P' },
];

const TYPE_COLORS: Record<string, string> = {
  ISTJ: '#4A90D9', ISFJ: '#7B9BA6', INFJ: '#9B59B6', INTJ: '#2C3E50',
  ISTP: '#27AE60', ISFP: '#E67E22', INFP: '#E91E8A', INTP: '#3498DB',
  ESTP: '#F39C12', ESFP: '#FF6B6B', ENFP: '#FF9FF3', ENTP: '#00CEC9',
  ESTJ: '#2ECC71', ESFJ: '#FD79A8', ENFJ: '#6C5CE7', ENTJ: '#E74C3C',
};

export default function SharePage() {
  const [params] = useSearchParams();
  const posterRef = useRef<HTMLDivElement>(null);

  const type = (params.get('type') || 'ENFP') as MBTIType;
  const description = getMBTIDescription(type);
  const color = TYPE_COLORS[type] || '#667eea';

  const dims = DIMENSION_LABELS.map(d => {
    const lv = parseFloat(params.get(d.lk) || '50');
    const rv = parseFloat(params.get(d.rk) || '50');
    const total = lv + rv || 100;
    return { ...d, leftPct: Math.round((lv / total) * 100), rightPct: Math.round((rv / total) * 100) };
  });

  useEffect(() => {
    if (!posterRef.current) return;
    const timer = setTimeout(() => {
      html2pdf().from(posterRef.current!).set({
        margin: 0,
        filename: `MBTI_${type}_海报.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      }).save();
    }, 800);
    return () => clearTimeout(timer);
  }, [type]);

  return (
    <div className="share-page" style={{ '--accent': color, '--accent-dark': color + 'b3' } as React.CSSProperties}>
      <div className="share-card" ref={posterRef}>
        <div className="share-wave" />
        <div className="share-inner">
          <div className="share-badge">MBTI 性格测试报告</div>
          <div className="share-type">{type}</div>
          <div className="share-desc">{description}</div>
          <div className="share-divider" />
          <div className="share-dims">
            {dims.map(d => (
              <div key={d.key} className="share-dim">
                <span className="share-dim-label">{d.left}</span>
                <div className="share-dim-bar">
                  <div className="share-dim-fill" style={{ width: `${d.leftPct}%` }}>
                    {d.leftPct > 20 && `${d.leftPct}%`}
                  </div>
                  <div className="share-dim-empty" style={{ width: `${d.rightPct}%` }}>
                    {d.rightPct > 20 && `${d.rightPct}%`}
                  </div>
                </div>
                <span className="share-dim-label">{d.right}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="share-footer-text">
          <span>MBTI 性格测试与就业推荐系统</span>
        </div>
      </div>
      <p className="share-tip">PDF 已自动下载，请查看本地文件</p>
    </div>
  );
}
