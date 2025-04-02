const videoCardContainer = document.querySelector('.video-container')

let api_key = "AIzaSyDhpr088H7gsz5oMBYXgSYSGidMNHBGqvY";
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?"

fetch(video_http + new URLSearchParams({
    key: api_key,
    part: 'snippet,contentDetails,statistics',
    chart: 'mostPopular',
    maxResults: 20,
    regionCode: 'PH'
}))
.then(res => res.json())
.then(data => {
    // console.log(data);
    data.items.forEach(item => {
        getChannelIcon(item);
    })
})
.catch(err => console.log(err));


const getChannelIcon = (video_data) => {
    fetch(channel_http + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        id: video_data.snippet.channelId
    }))
    .then(res => res.json())
    .then(data => {
        video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
        makeVideoCard(video_data);
    })
}

const makeVideoCard = (data) => {
    // Format the view count with commas
    const viewCount = parseInt(data.statistics.viewCount).toLocaleString();
    
    // Format the publish date
    const publishedDate = new Date(data.snippet.publishedAt);
    const timeAgo = getTimeAgo(publishedDate);
    
    videoCardContainer.innerHTML += `
    <div class="video" onclick="location.href = 'https://youtube.com/watch?v=${data.id}'">
        <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="">
        <div class="content">
            <img src="${data.channelThumbnail}" class="channel-icon" alt="">
            <div class="info">
                <h4 class="title">${data.snippet.title}</h4>
                <p class="channel-name">${data.snippet.channelTitle}</p>
                <p class="video-stats">${viewCount} views • ${timeAgo}</p>
            </div>
        </div>
    </div>
    `;
}

// Helper function to format the time ago
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    // Time intervals in seconds
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    if (seconds < 60) return 'just now';
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
        }
    }
}

// search bar

const searchInput = document.querySelector('.search-bar');
const searchBtn = document.querySelector('.search-btn');
let searchLink = 'https://www.youtube.com/results?search_query='

searchBtn.addEventListener('click', () => {
    if(searchInput.value.length){
        location.href = searchLink + searchInput.value;
    }
})