import { DAYS, MONTHS } from '../../data/mockData';
import { buildCalendarCells, getDateKey, getTodayKey } from '../../utils/formatters';

export default function CalendarGrid({
  year,
  month,
  selectedDate,
  onSelectDate,
  dotMap = {},
  onPrevMonth,
  onNextMonth,
  legend = [],
}) {
  const cells = buildCalendarCells(year, month);
  const todayKey = getTodayKey();

  return (
    <div className="card">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600 }}>
          {MONTHS[month - 1]} {year}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="btn-s" style={{ padding: '4px 8px' }} onClick={onPrevMonth}>
            ←
          </button>
          <button className="btn-s" style={{ padding: '4px 8px' }} onClick={onNextMonth}>
            →
          </button>
        </div>
      </div>

      <div className="cal-grid" style={{ marginBottom: 2 }}>
        {DAYS.map((day) => (
          <div key={day} className="cdh">
            {day}
          </div>
        ))}
      </div>

      <div className="cal-grid">
        {cells.map((cell, index) => {
          if (!cell.isCurrentMonth) {
            return (
              <div key={`${cell.day}-${index}`} className="cc om">
                {cell.day}
              </div>
            );
          }

          const cellKey = getDateKey(year, month, cell.day);
          const dots = dotMap[cellKey] || [];
          const isToday = cellKey === todayKey;
          const isSelected = cellKey === selectedDate;

          return (
            <div
              key={cellKey}
              className={`cc ${isToday ? 'tod' : ''} ${isSelected && !isToday ? 'sel' : ''}`}
              onClick={() => onSelectDate(cellKey)}
            >
              {cell.day}
              {dots.length ? (
                <div className="cdots">
                  {dots.slice(0, 3).map((dot, dotIndex) => (
                    <div
                      key={`${cellKey}-${dotIndex}`}
                      className="cdot"
                      style={{ background: isToday ? 'rgba(255,255,255,.85)' : dot }}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {legend.length ? (
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            borderTop: '0.5px solid var(--color-border-tertiary)',
            paddingTop: 10,
          }}
        >
          {legend.map((item) => (
            <div
              key={item.label}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10 }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: item.color,
                }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
