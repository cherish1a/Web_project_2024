const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const https = require('https');
const fs = require('fs');
const app = express();


// 환경 변수에서 API 키 가져오기 (보안을 위해 환경 변수 사용)
const API_KEY = process.env.YOUTUBE_API_KEY;

// 모든 출처 허용
app.use(cors({
  origin: '*',  // 모든 출처 허용
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 유튜브 API 설정
const youtube = google.youtube({
  version: 'v3',
  auth: API_KEY,
});

// 채널 ID 통해 가져오기
app.get('/getVideos', async (req, res) => {
  console.log('채널ID 통해 비디오 가져오고 있습니다.');
  const channelId = req.query.channelId;

  if (!channelId) {
    return res.status(400).json({ error: '채널 ID가 필요합니다.' });
  }

  try {
    // 채널의 비디오 ID 가져오기
    const searchResponse = await youtube.search.list({
      part: 'id',
      channelId: channelId,
      maxResults: 10, // 최신 10개 비디오
      order: 'date', // 최신순
    });

    const videoIds = searchResponse.data.items
      .map(item => item.id.videoId)
      .filter(id => id); // videoId만 필터링

    if (videoIds.length === 0) {
      return res.status(404).json({ error: '비디오가 없습니다.' });
    }

    // 비디오 상세 정보 가져오기
    const videosResponse = await youtube.videos.list({
      part: 'snippet,statistics',
      id: videoIds.join(','),
    });

    // 필요한 데이터 추출
    const videos = videosResponse.data.items.map(item => ({
      title: item.snippet.title,
      viewCount: parseInt(item.statistics.viewCount, 10),  // 조회수
      likeCount: parseInt(item.statistics.likeCount || 0, 10), // 좋아요 수 (없을 경우 0 처리)
      publishedAt: item.snippet.publishedAt, // 업로드 시간
    }));

    res.json(videos);
  } catch (error) {
    console.error('유튜브 API 호출 오류:', error);
    res.status(500).json({ error: '데이터를 가져오는 데 실패했습니다.' });
  }
});

// SSL 인증서 설정
const credentials = {
  cert: fs.readFileSync('/etc/letsencrypt/live/cher1sh1.com/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/cher1sh1.com/privkey.pem')
};

// HTTPS 서버 실행
https.createServer(credentials, app).listen(3000, '0.0.0.0', () => {
  console.log('HTTPS 서버가 https://cher1sh1.com:3000에서 실행 중입니다.');
});
