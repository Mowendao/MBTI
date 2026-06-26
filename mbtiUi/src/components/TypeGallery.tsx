import { useState } from 'react';
import type { MBTIType } from '@/types/mbti';
import { getTypeProfile, TYPE_COLORS } from '@/data/typeProfiles';
import { TYPE_AESTHETICS, ELEMENT_MAP, SEASON_MAP } from '@/data/typeAesthetics';
import './TypeGallery.css';

const ALL_TYPES: MBTIType[] = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ',
];

const ELEMENTS = ['全部', '火', '水', '风', '土'];

export default function TypeGallery() {
  const [filter, setFilter] = useState('全部');
  const [selected, setSelected] = useState<MBTIType | null>(null);

  const filtered = filter === '全部'
    ? ALL_TYPES
    : (ELEMENT_MAP[filter]?.types || []);

  const handleSelect = (type: MBTIType) => {
    setSelected(selected === type ? null : type);
  };

  return (
    <div className="gallery-page">
      <div className="gallery-container">
        {/* Header */}
        <div className="gallery-header">
          <h1>🎨 人格气质画廊</h1>
          <p>每种 MBTI 类型都有独特的气质美学——元素、季节、色彩与氛围</p>
        </div>

        {/* Element filter */}
        <div className="gallery-filter">
          {ELEMENTS.map(el => (
            <button
              key={el}
              className={`gf-btn ${filter === el ? 'active' : ''}`}
              onClick={() => { setFilter(el); setSelected(null); }}
            >
              {el === '全部' ? '✨ 全部' : `${ELEMENT_MAP[el]?.types.length === 1 ? '🔥' : ELEMENT_MAP[el]?.types.length === 3 ? '🌊' : '💨'} ${el}`}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="gallery-grid">
          {filtered.map(type => {
            const aesthetic = TYPE_AESTHETICS[type];
            const profile = getTypeProfile(type);
            const color = TYPE_COLORS[type];
            const isSelected = selected === type;
            return (
              <div
                key={type}
                className={`gg-card ${isSelected ? 'expanded' : ''}`}
                style={{ '--accent': color, '--accent-light': color + '22' } as React.CSSProperties}
                onClick={() => handleSelect(type)}
              >
                {/* Front face */}
                <div className="gg-front">
                  <div className="gg-badge-row">
                    <span className="gg-element">{aesthetic.elementIcon}</span>
                    <span className="gg-season">{aesthetic.seasonIcon}</span>
                    <span className="gg-time">{aesthetic.timeIcon}</span>
                  </div>
                  <span className="gg-type">{type}</span>
                  <span className="gg-title">{profile.title}</span>
                  <div className="gg-vibe">
                    {aesthetic.vibe.map(v => <span key={v} className="gg-vibe-tag">{v}</span>)}
                  </div>
                  <div className="gg-palette">
                    {aesthetic.palette.map((c, i) => (
                      <span key={i} className="gg-palette-dot" style={{ background: c }} title={c} />
                    ))}
                  </div>
                  <span className="gg-symbol">{aesthetic.symbolIcon} {aesthetic.symbol}</span>
                </div>

                {/* Expanded detail */}
                {isSelected && (
                  <div className="gg-back">
                    <div className="ggb-row">
                      <div className="ggb-stat">
                        <span className="ggb-stat-icon">{aesthetic.elementIcon}</span>
                        <span className="ggb-stat-label">元素 · {aesthetic.element}</span>
                        <span className="ggb-stat-desc">{ELEMENT_MAP[aesthetic.element]?.desc}</span>
                      </div>
                      <div className="ggb-stat">
                        <span className="ggb-stat-icon">{aesthetic.seasonIcon}</span>
                        <span className="ggb-stat-label">季节 · {aesthetic.season}</span>
                        <span className="ggb-stat-desc">{SEASON_MAP[aesthetic.season]?.desc}</span>
                      </div>
                      <div className="ggb-stat">
                        <span className="ggb-stat-icon">{aesthetic.timeIcon}</span>
                        <span className="ggb-stat-label">时刻 · {aesthetic.time}</span>
                      </div>
                    </div>

                    <div className="ggb-palette">
                      <span className="ggb-palette-label">🎨 气质配色</span>
                      <div className="ggb-palette-bar">
                        {aesthetic.palette.map((c, i) => (
                          <span key={i} className="ggb-palette-chip" style={{ background: c }} />
                        ))}
                      </div>
                    </div>

                    <div className="ggb-motto">
                      <span className="ggb-motto-icon">{aesthetic.symbolIcon}</span>
                      <span className="ggb-motto-text">「{aesthetic.motto}」</span>
                    </div>

                    <p className="ggb-desc">{profile.description}</p>

                    {profile.famousPeople.length > 0 && (
                      <div className="ggb-famous">
                        <span>🌟 代表人物</span>
                        <div className="ggb-famous-list">
                          {profile.famousPeople.slice(0, 4).map((p, i) => (
                            <span key={i} className="ggb-famous-chip">{p}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
