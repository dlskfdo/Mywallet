// 현재 날짜와 관련된 변수 설정
const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedDayElement = null; // 선택된 날짜를 추적
let selectedDate = null; // 선택된 날짜

// DOM 요소들
const monthSelector = document.querySelector('.calendar-month-selector');
const prevMonthBtn = document.querySelector('.prev-month');
const nextMonthBtn = document.querySelector('.next-month');
const calendarGrid = document.querySelector('.calendar-grid');
const notepadTextarea = document.querySelector('textarea'); // 메모장 텍스트 영역

// 달력 렌더링 함수
function renderCalendar(month, year) {
  monthSelector.innerText = `${getMonthName(month)} ${year}`; // 월과 연도를 표시

  const firstDay = new Date(year, month, 1); // 이번 달 첫 번째 날
  const lastDay = new Date(year, month + 1, 0); // 이번 달 마지막 날
  
  let dayOfWeek = firstDay.getDay(); // 첫 번째 날의 요일
  let numDays = lastDay.getDate(); // 이번 달의 일수
  
  calendarGrid.innerHTML = ''; // 기존 달력 초기화
  
  // 요일 헤더 추가
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  daysOfWeek.forEach(day => {
    const dayElement = document.createElement('div');
    dayElement.classList.add('calendar-day', 'disabled');
    dayElement.textContent = day;
    calendarGrid.appendChild(dayElement);
  });

  // 이전 달의 빈 칸 추가
  for (let i = 0; i < dayOfWeek; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.classList.add('calendar-day', 'disabled');
    calendarGrid.appendChild(emptyDay);
  }

  // 이번 달의 날짜들 추가
  for (let i = 1; i <= numDays; i++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('calendar-day');
    dayElement.textContent = i;

    // 오늘 날짜는 빨간색 배경
    if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      dayElement.classList.add('today');
    }

    // 날짜 클릭 시 선택된 날짜 처리
    dayElement.addEventListener('click', function () {
      if (selectedDayElement) {
        selectedDayElement.classList.remove('selected'); // 이전 선택된 날짜의 스타일 해제
      }

      dayElement.classList.add('selected'); // 클릭된 날짜에 'selected' 클래스 추가
      selectedDayElement = dayElement; // 현재 선택된 날짜 저장
      selectedDate = new Date(year, month, i); // 선택된 날짜 저장

      // 선택된 날짜에 대한 메모 불러오기
      loadMemoForSelectedDate();
    });

    calendarGrid.appendChild(dayElement);
  }
}

// 선택된 날짜에 대한 메모 불러오기
function loadMemoForSelectedDate() {
  if (selectedDate) {
    const storedMemo = localStorage.getItem(selectedDate.toISOString());
    if (storedMemo) {
      notepadTextarea.value = storedMemo; // 저장된 메모가 있으면 메모장에 로드
    } else {
      notepadTextarea.value = ''; // 메모가 없으면 빈 메모장
    }
  }
}

// 메모 저장 기능 (입력될 때마다 실행)
notepadTextarea.addEventListener('input', function () {
  if (selectedDate) {
    localStorage.setItem(selectedDate.toISOString(), notepadTextarea.value); // 메모 저장
  }
});

// 월 이름을 반환하는 함수
function getMonthName(month) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
}

// 이전 달 버튼 클릭 시 처리
prevMonthBtn.addEventListener('click', () => {
  if (currentMonth === 0) {
    currentMonth = 11;
    currentYear--;
  } else {
    currentMonth--;
  }
  renderCalendar(currentMonth, currentYear);
});

// 다음 달 버튼 클릭 시 처리
nextMonthBtn.addEventListener('click', () => {
  if (currentMonth === 11) {
    currentMonth = 0;
    currentYear++;
  } else {
    currentMonth++;
  }
  renderCalendar(currentMonth, currentYear);
});

// 초기 달력 렌더링
renderCalendar(currentMonth, currentYear);
