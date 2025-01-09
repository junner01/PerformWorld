document.addEventListener("DOMContentLoaded", function () {
    const Grid = tui.Grid;

    // ToastUI Grid 테마 설정
    Grid.applyTheme('clean', {
        cell: {
            normal: {
                border: 'gray',
                showVerticalBorder: true,
                showHorizontalBorder: true
            },
            header: {
                background: 'gray',
                text: 'white',
                border: 'white'
            }
        }
    });

    // ToastUI Grid 초기화
    const grid = new Grid({
        el: document.getElementById('eventListGrid'),
        scrollX: false, // 가로 스크롤 비활성화
        scrollY: false, // 세로 스크롤 비활성화
        minBodyHeight: 590, // 최소 높이 설정
        pageOptions: {
            useClient: true,
            perPage: 10
        },
        columns: [
            {
                header: '선택',
                name: 'select',
                align: 'center',
                width: 50,
                formatter: ({ rowKey }) => {
                    return `<input type="checkbox" class="row-checkbox" data-row-key="${rowKey}" />`;
                }
            },
            {
                header: '썸네일',
                name: 'thumbnailUrl',
                align: 'center',
                width: 100,
                formatter: ({ value }) => `<img src="${value}" alt="썸네일" style=" height: 50px;">`
            },
            { header: '이벤트 ID', name: 'eventId', align: 'center', minWidth: 10 , hidden: true},
            { header: '제목', name: 'title', align: 'center', minWidth: 250 },
            { header: '시작일', name: 'prfpdfrom', align: 'center', minWidth: 120 },
            { header: '종료일', name: 'prfpdto', align: 'center', minWidth: 120 },
            { header: '위치', name: 'location', align: 'center', minWidth: 150 },
            { header: '장르', name: 'genre', align: 'center', minWidth: 100 }
        ],
        data: [] // 초기 데이터 비어있음
    });

// 리사이즈 이벤트 처리
    window.addEventListener('resize', () => {
        grid.bodyHeight = getGridHeight(); // 창 크기 변경 시 그리드 높이 갱신
        grid.refreshLayout(); // 그리드 레이아웃 갱신
    });

    // 이벤트 목록 로드 함수
    const loadEvents = async () => {
        const titleSearch = document.getElementById('titleSearch').value.toLowerCase();
        const genreFilter = document.getElementById('genre-code').value;
        let url = '/event/savedEventList';

        // 조건에 따른 URL 파라미터 추가
        if (titleSearch) url += `?title=${titleSearch}`;
        if (genreFilter) url += titleSearch ? `&genre=${genreFilter}` : `?genre=${genreFilter}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            const events = data || []; // 응답 데이터가 없을 경우 빈 배열로 처리
            grid.resetData(events); // 그리드 데이터 갱신
            grid.refreshLayout(); // 데이터 추가 후 그리드 레이아웃 갱신
        } catch (error) {
            console.error('Error loading events:', error);
            alert('이벤트 목록을 불러오는 중 오류가 발생했습니다.');
        }
    };

    // 선택된 이벤트 삭제 함수
    const deleteSelectedEvents = async () => {
        const checkedCheckboxes = document.querySelectorAll('.row-checkbox:checked'); // 체크된 체크박스들
        const eventIds = [];

        checkedCheckboxes.forEach(checkbox => {
            const rowKey = checkbox.getAttribute('data-row-key');
            const rowData = grid.getRow(rowKey);
            eventIds.push(rowData.eventId);
        });

        if (eventIds.length === 0) {
            alert("삭제할 이벤트를 선택해주세요.");
            return;
        }

        if (!confirm("선택한 이벤트를 삭제하시겠습니까?")) return;

        try {
            // axios로 DELETE 요청 보내기
            const response = await axios({
                method: 'DELETE',
                url: '/event/deleteEvent', // 삭제할 이벤트들의 엔드포인트
                headers: {
                    'Content-Type': 'application/json' // 요청 헤더
                },
                data: { eventIds } // 삭제할 이벤트 ID들을 요청 본문에 담아 전송
            });

            // 서버 응답을 처리
            if (response.status === 200) {
                alert('선택한 이벤트가 삭제되었습니다.');
                loadEvents(); // 삭제 후 다시 로드
            } else {
                alert('이벤트 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error deleting events:', error);
            alert('이벤트 삭제 중 오류가 발생했습니다.');
        }
    };

    // 검색 버튼 이벤트
    document.getElementById('searchButton').addEventListener('click', loadEvents);

    // 삭제 버튼 이벤트
    document.getElementById('eventDeleteBtn').addEventListener('click', deleteSelectedEvents);

    // 페이지 로드 시 이벤트 목록 초기화
    loadEvents();
});