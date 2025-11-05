import React, { useEffect, useState } from 'react';
</div>
</div>
)}
</aside>
</main>


<footer style={{ marginTop: 32 }}>
<small>Prototype — adapt styling and hosting to your needs before going live.</small>
</footer>
</div>
);
}


function SmallCalendar({ bookedRanges }) {
const months = [];
const today = new Date();
for (let m = 0; m < 3; m++) {
const dt = new Date(today.getFullYear(), today.getMonth() + m, 1);
months.push(dt);
}


function isBookedDate(date) {
for (const r of bookedRanges) {
const rs = new Date(r.start);
const re = new Date(r.end);
if (date >= rs && date < re) return true;
}
return false;
}


return (
<div>
{months.map((m, idx) => (
<div key={idx} style={{ display: 'inline-block', verticalAlign: 'top', marginRight: 16 }}>
<MonthView monthStart={m} isBookedDate={isBookedDate} />
</div>
))}
</div>
);
}


function MonthView({ monthStart, isBookedDate }) {
const year = monthStart.getFullYear();
const month = monthStart.getMonth();
const firstDay = new Date(year, month, 1).getDay();
const daysInMonth = new Date(year, month + 1, 0).getDate();
const weeks = [];
let cells = [];
for (let i = 0; i < firstDay; i++) cells.push(null);
for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
while (cells.length) {
weeks.push(cells.splice(0, 7));
}
return (
<table style={{ borderCollapse: 'collapse' }}>
<caption style={{ textAlign: 'left', marginBottom: 6 }}>{monthStart.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</caption>
<thead>
<tr>
{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(h => <th key={h} style={{ width: 28, fontSize: 12 }}>{h}</th>)}
</tr>
</thead>
<tbody>
{weeks.map((week, i) => (
<tr key={i}>
{week.map((cell, j) => (
<td key={j} style={{ width: 28, heigh
