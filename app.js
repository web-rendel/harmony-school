document.addEventListener('DOMContentLoaded', () => {
  const copyLinks = document.querySelectorAll('.text-bg-secondary');

  copyLinks.forEach((copyLink) => {
    copyLink.addEventListener('click', (e) => {
      const parentBlock = e.target.closest('.d-flex');
      const link = parentBlock.querySelector('a');

      if (link) {
        const url = link.href;
        navigator.clipboard
          .writeText(url)
          .then(() => {
            const originalText = copyLink.innerHTML;
            copyLink.textContent = 'Copied!';
            setTimeout(() => {
              copyLink.innerHTML = originalText;
            }, 1000);
          })
          .catch((err) => {
            console.error('Не удалось скопировать текст:', err);
          });
      }
    });
  });

  // Smart Timetable logic
  const bellSchedule = [
    { num: 1, start: '08:00', end: '08:40' },
    { num: 2, start: '08:45', end: '09:25' },
    { num: 3, start: '09:35', end: '10:15' },
    { num: 4, start: '10:20', end: '11:00' },
    { num: 5, start: '11:10', end: '11:50' },
    { num: 6, start: '12:00', end: '12:40' },
    { num: 7, start: '12:45', end: '13:25' },
    { num: 8, start: '13:35', end: '14:15' },
    { num: 9, start: '14:20', end: '15:00' },
    { num: 10, start: '15:10', end: '15:50' },
  ];

  function updateSmartTimetable() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday

    const days = document.querySelectorAll(
      '.timetable-classes__body > .timetable-classes__day',
    );

    // Process Monday-Friday (indices 0-4 relative to the schedule grid)
    days.forEach((d, index) => {
      // Is today this day block? (index 0 corresponds to Monday (1), etc.)
      const isTodayBlock =
        dayOfWeek >= 1 && dayOfWeek <= 5 && index === dayOfWeek - 1;

      if (isTodayBlock) {
        d.classList.add('is-current-day');

        const currentH = now.getHours();
        const currentM = now.getMinutes();
        const currentTotalM = currentH * 60 + currentM;

        // Find if we are currently in a lesson
        let currentLessonNum = null;
        let msEndLesson = null;

        for (const bell of bellSchedule) {
          const [startH, startM] = bell.start.split(':').map(Number);
          const [endH, endM] = bell.end.split(':').map(Number);
          const startTotalM = startH * 60 + startM;
          const endTotalM = endH * 60 + endM;

          if (currentTotalM >= startTotalM && currentTotalM < endTotalM) {
            currentLessonNum = bell.num;
            const endDate = new Date(now);
            endDate.setHours(endH, endM, 0, 0);
            msEndLesson = endDate.getTime();
            break;
          }
        }

        const lessonItems = d.querySelectorAll(
          '.timetable-classes__items-item',
        );
        lessonItems.forEach((item) => {
          const numDiv = item.querySelector('.timetable-classes__items-num');

          if (
            currentLessonNum !== null &&
            numDiv &&
            parseInt(numDiv.textContent.trim()) === currentLessonNum
          ) {
            item.classList.add('is-current-lesson');

            const diffSec = Math.floor((msEndLesson - now.getTime()) / 1000);
            const diffM = Math.floor(diffSec / 60);
            const diffS = diffSec % 60;
            const diffSStr = diffS.toString().padStart(2, '0');

            let timerDiv = item.querySelector('.lesson-timer');
            if (!timerDiv) {
              timerDiv = document.createElement('div');
              timerDiv.className = 'lesson-timer badge text-bg-success ms-2';
              timerDiv.style.display = 'inline-block';
              timerDiv.style.verticalAlign = 'middle';

              const lessonDiv = item.querySelector(
                '.timetable-classes__items-lesson',
              );
              if (lessonDiv) {
                lessonDiv.appendChild(timerDiv);
              }
            }
            timerDiv.innerHTML = `&#128336; До кінця: ${Math.max(0, diffM)}:${diffSStr}`;
          } else {
            item.classList.remove('is-current-lesson');
            const timerObj = item.querySelector('.lesson-timer');
            if (timerObj) timerObj.remove();
          }
        });
      } else {
        d.classList.remove('is-current-day');
        const lessonItems = d.querySelectorAll(
          '.timetable-classes__items-item',
        );
        lessonItems.forEach((item) => {
          item.classList.remove('is-current-lesson');
          const timerObj = item.querySelector('.lesson-timer');
          if (timerObj) timerObj.remove();
        });
      }
    });
  }

  setInterval(updateSmartTimetable, 1000);
  updateSmartTimetable();
});
