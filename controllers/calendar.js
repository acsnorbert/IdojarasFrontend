let calYear, calMonth;

function initCalendar() {
    const today = new Date();
    calYear = today.getFullYear();
    calMonth = today.getMonth();

    document.getElementById('prevMonth').addEventListener('click', ()=>changeMonth(-1));
    document.getElementById('nextMonth').addEventListener('click', ()=>changeMonth(1));

    generateCalendar(calYear, calMonth);
}

function changeMonth(delta){
    calMonth += delta;
    if(calMonth<0){ calMonth=11; calYear--; }
    if(calMonth>11){ calMonth=0; calYear++; }
    generateCalendar(calYear, calMonth);
}

function generateCalendar(year, month){
    const calendarBody = document.getElementById('calendarBody');
    const calendarHeader = document.getElementById('calendarHeader');
    calendarBody.innerHTML = '';
    calendarHeader.innerHTML = '';

    const days = ['Hétfő','Kedd','Szerda','Csütörtök','Péntek','Szombat','Vasárnap'];
    days.forEach(day=>{
        const th = document.createElement('th');
        th.innerText = day;
        calendarHeader.appendChild(th);
    });

    const firstDay = new Date(year, month, 1);
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay-1; // Hétfő=0

    const daysInMonth = new Date(year, month+1, 0).getDate();
    let date = 1;
    for(let i=0;i<6;i++){
        const tr = document.createElement('tr');
        for(let j=0;j<7;j++){
            const td = document.createElement('td');
            if(i===0 && j<startDay) td.innerHTML='';
            else if(date>daysInMonth) td.innerHTML='';
            else{
                td.innerHTML = `<strong>${date}</strong><br>`;
                const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(date).padStart(2,'0')}`;
                const dayData = idojaras.find(i => i.date===dateStr && i.userId===loggedUser.id);
                if(dayData){
                    td.innerHTML += `${dayData.minFok}°C - ${dayData.maxFok}°C<br>${dayData.idojarasAdat}`;
                }
                date++;
            }
            tr.appendChild(td);
        }
        calendarBody.appendChild(tr);
    }

    // Hónap kijelzése
    const monthNames = ['Január','Február','Március','Április','Május','Június','Július','Augusztus','Szeptember','Október','November','December'];
    document.getElementById('currentMonth').innerText = `${monthNames[month]} ${year}`;
}
