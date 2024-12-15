// 서버의 URL
const SERVER_URL = 'https://34.64.218.204:3000';

const channelId = 'UC1sELGmy5jp5fQUugmuYlXQ'; // 마인크래프트 채널 ID

// 서버에 요청을 보내고 응답 데이터를 사용
async function fetchVideos(channelId) {
  try {
    const response = await fetch(`${SERVER_URL}/getVideos?channelId=${channelId}`);
    const videos = await response.json();
    console.log(videos); // 가져온 영상 데이터
    drawChart(videos); // 데이터를 차트로 시각화하는 함수 호출
  } catch (error) {
    console.error('Error fetching videos:', error);
  }
}

// 페이지 로드 시 자동으로 채널 ID를 가져와서 영상 데이터 불러오기
async function loadDataOnLoad() {
  // 채널 ID가 유효한 경우에만 영상 데이터를 가져오기 시작
  fetchVideos(channelId); // 채널 ID를 사용해 비디오 데이터 가져오기

  // 1시간마다 데이터를 갱신
  setInterval(() => fetchVideos(channelId), 3600000);  // 3600000ms = 1시간
}

// 차트 그리기 함수
function drawChart(videos) {
  // 비디오 제목, 조회수, 좋아요 수, 업로드 날짜를 배열로 변환
  const videoTitles = videos.map(video => video.title);
  const viewCounts = videos.map(video => video.viewCount);  // 서버에서 조회수 데이터 받음
  const likeCounts = videos.map(video => video.likeCount);  // 서버에서 좋아요 수 데이터 받음
  
  // 업로드 날짜를 가져와서 표시할 형식으로 변환
  const publishedDates = videos.map(video => {
    const date = new Date(video.publishedAt); // 비디오 업로드 날짜
    return date.toLocaleDateString(); // 날짜를 형식에 맞게 변환 (예: '2024-12-12')
  });

  // x축 레이블에는 날짜만 표시
  const labels = publishedDates;


  const ctx = document.getElementById('videoChart').getContext('2d');
  
  // 차트 스타일
  const chart = new Chart(ctx, {
    type: 'bar',  // 기본 차트 유형은 바 차트
    data: {
      labels: labels,  // x축에 날짜만 표시
      datasets: [{
        label: '조회수',
        data: viewCounts,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        borderRadius: 5,
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
        hoverBorderColor: 'rgba(54, 162, 235, 1)',
        type: 'bar',  // 조회수는 바 차트로 표시
        yAxisID: 'y1'  // 첫 번째 y축에 매핑
      }, {
        label: '좋아요',
        data: likeCounts,
        borderColor: 'rgba(255, 99, 132, 1)',  // 라인 차트의 선 색상
        backgroundColor: 'rgba(255, 99, 132, 0.2)',  // 라인 차트의 배경색
        fill: false,  // 배경을 채우지 않음
        borderWidth: 2,
        tension: 0.3,  // 라인 차트의 부드러움 설정
        type: 'line',  // 좋아요는 라인 차트로 표시
        yAxisID: 'y2'  // 두 번째 y축에 매핑
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            // 툴팁에서 제목 표시
            title: function(tooltipItems) {
              const index = tooltipItems[0].dataIndex;
              return videoTitles[index];  // 툴팁에서 전체 제목 표시
            }
          },
          backgroundColor: 'rgba(0,0,0,0.7)',
          titleColor: '#fff',
          bodyColor: '#fff'
        },
        legend: {
          labels: {
            font: {
              size: 14
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: '업로드 날짜',
            color: '#333',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          ticks: {
            autoSkip: true,
            color: '#555',
            font: {
              size: 12
            }
          }
        },
        y1: {  // 첫 번째 y축 (조회수)
          beginAtZero: true,
          position: 'left',  // 왼쪽에 위치
          title: {
            display: true,
            text: '조회수',
            color: '#333',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          ticks: {
            color: '#555',
            font: {
              size: 12
            }
          }
        },
        y2: {  // 두 번째 y축 (좋아요)
          beginAtZero: true,
          position: 'right',  // 오른쪽에 위치
          title: {
            display: true,
            text: '좋아요 수',
            color: '#333',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            drawOnChartArea: false  // y2의 격자선을 제거하여 y1과 겹치지 않게 설정
          },
          ticks: {
            color: '#555',
            font: {
              size: 12
            }
          }
        }
      }
    }
  });
}

// 페이지가 로드되면 자동으로 데이터 로드
window.onload = loadDataOnLoad;
