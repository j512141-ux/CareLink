/**
 * CareLink Unified Application Logic
 * Consolidated from carelink_v28.js
 */

console.log('CareLink Core Logic Loaded v27');

/**
 * Toggle the visual state of timeline and list buttons
 */
function toggleAction(btn) {
    btn.classList.toggle('toggled');
}

function markInviteEnded(btn) {
    const timelineItem = btn.closest('.timeline-item');
    if (timelineItem) {
        timelineItem.remove();
    }
    showToast('因為有你，<br>多了陪伴!', 3200);
}

/**
 * Toast Notification Logic
 */
function showToast(message, duration = 2500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Add a checkmark icon for success-like messages
    const isSuccess = message.includes('成功') || message.includes('已') || message.includes('儲存');
    const iconHtml = isSuccess ? `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width: 60px; height: 60px; color: var(--primary); margin-bottom: 5px;">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    ` : '';

    toast.innerHTML = iconHtml + `<div>${message}</div>`;
    console.log("Toast shown:", message);

    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, duration);
}

/**
 * Open participants modal
 */
const GROUP_DICT = {
    '通知全家': [ {avatar:'cute_grandpa_avatar_1775137046957.png', name:'阿公'}, {avatar:'cute_daughter_avatar.png', name:'大女兒'}, {avatar:'cute_son_avatar.png', name:'大兒子'}, {avatar:'cute_daughter_avatar.png', name:'二媳婦'} ],
    '通知子女': [ {avatar:'cute_daughter_avatar.png', name:'大女兒'}, {avatar:'cute_son_avatar.png', name:'兒子'} ],
    '通知老友': [ {avatar:'cute_uncle_avatar.png', name:'老李'}, {avatar:'cute_aunt_avatar.png', name:'陳阿姨'}, {avatar:'cute_uncle_avatar.png', name:'張大叔'}, {avatar:'cute_aunt_avatar.png', name:'王太太'} ],
    '邀約通知': [ {avatar:'cute_daughter_avatar.png', name:'大女兒'}, {avatar:'cute_son_avatar.png', name:'大兒子'}, {avatar:'cute_daughter_avatar.png', name:'二媳婦'} ]
};

let HELP_TASKS = [
    { id: 100, type: '想有人一起吃晚餐', who: '王爺爺', date: '週三', time: '早上 08:00', location: '青年公園', status: 'available', avatar: 'cute_grandpa_avatar_1775137046957.png', helpers: [ { name: '大女兒', avatar: 'cute_daughter_avatar.png' } ], createdBy: '王爺爺' },
    { id: 101, type: '陪散步', who: '老李', date: '4月8日', time: '下午 16:00', location: '青年公園', status: 'available', avatar: 'cute_uncle_avatar.png', helpers: [], createdBy: '老李' },
    { id: 102, type: '代買豆漿', who: '陳阿姨', date: '4月8日', time: '早上 07:30', location: '巷口早餐店', status: 'ongoing', avatar: 'cute_aunt_avatar.png', helpers: [ { name: '大兒子', avatar: 'cute_son_avatar.png' } ], createdBy: '陳阿姨' },
    { id: 201, type: '幫忙買菜', who: '王爺爺', date: '週日', time: '中午 12:00', location: '巷口熱炒店', status: 'available', avatar: 'cute_grandpa_avatar_1775137046957.png', helpers: [], createdBy: '王爺爺' },
    { id: 202, type: '幫我搬點東西', who: '王爺爺', date: '週五', time: '下午 14:00', location: '里民活動中心', status: 'available', avatar: 'cute_grandpa_avatar_1775137046957.png', helpers: [], createdBy: '王爺爺' }
];

let favoriteFriends = [];

let USER_SKILLS = {
    '陪散步': 3,
    '代買': 2,
    '生活協助': 1
};

let currentStoryText = '阿北擅長搬運與整理貨物，動作俐落有條理，也會顧攤做生意、快速應對客人，善於聊天與記住需求，用長年經驗累積出穩定又細心、可靠的能力。';
let currentSkills = ['搬運整理', '顧攤接客'];
let currentUserName = '王爺爺';
let selectedSharePhoto = '';

function renderMySharePosts() {
    const myList = document.getElementById('sharewall-me-carousel');
    const myWrapper = document.getElementById('sharewall-me-wrapper');
    const emptyNotice = document.getElementById('my-post-empty');
    if (!myList) return;
    
    // Inject 3 new high-quality posts if empty
    if (myList.children.length === 0) {
        const samplePosts = [
            {
                img: 'post_gardening_grandpa_1776596447661.png',
                likes: 12,
                text: '今天早起整理了陽台的盆栽，看到新芽長出來，心裡真舒坦。'
            },
            {
                img: 'post_home_dish_1776596569259.png',
                likes: 8,
                text: '煮了一鍋牛肉麵，香氣撲鼻，等孩子們回來一起吃。'
            },
            {
                img: 'post_calligraphy_1776596936047.png',
                likes: 5,
                text: '靜下心來練幾張毛筆字，心境平穩了不少。'
            }
        ];
        
        samplePosts.forEach(post => {
            const entry = document.createElement('div');
            entry.className = 'timeline-item';
            entry.style.paddingLeft = '0';
            entry.innerHTML = `
                <div class="diary-post-card">
                    <div class="diary-banner">
                        <img src="${post.img}" alt="我的貼文照片">
                    </div>
                    <div class="diary-body">
                        <div class="like-row">
                            <button class="big-action-btn like-btn" disabled aria-label="讚"></button>
                            <span class="like-count">${post.likes}</span>
                        </div>
                        <div class="diary-post-text">${post.text}</div>
                    </div>
                </div>
            `;
            myList.appendChild(entry);
        });
    }

    if (myWrapper) myWrapper.style.display = 'flex';
    myList.style.display = 'flex';
    if (emptyNotice && myList.children.length > 0) {
        emptyNotice.style.display = 'none';
    }
}

function renderAllSharePosts() {
    const allList = document.getElementById('sharewall-all-carousel');
    if (!allList) return;
    
    if (allList.children.length === 0) { 
        const otherPosts = [
            {
                img: 'others_post_market.png',
                name: '王奶奶',
                avatar: 'cute_aunt_avatar.png',
                likes: 14,
                text: '早上去市場買了很漂亮的高麗菜和排骨，準備晚上煮湯。'
            },
            {
                img: 'others_post_tea.png',
                name: '陳阿公',
                avatar: 'cute_uncle_avatar.png',
                likes: 9,
                text: '今天跟老朋友去公園泡茶，非常開心！天氣也很好。'
            },
            {
                img: 'others_post_yoga.png',
                name: '李阿姨',
                avatar: 'cute_aunt_avatar.png',
                likes: 7,
                text: '剛剛做完瑜伽，感覺身體輕鬆多了。推薦大家一起來運動！'
            },
            {
                img: 'others_post_garden.png',
                name: '張伯伯',
                avatar: 'cute_uncle_avatar.png',
                likes: 11,
                text: '今天整理了小菜園，收穫了不少。'
            }
        ];
        
        // Clear placeholder comment
        allList.innerHTML = '';
        
        otherPosts.forEach(post => {
            const entry = document.createElement('div');
            entry.className = 'timeline-item';
            entry.style.paddingLeft = '0';
            entry.innerHTML = `
                <div class="diary-post-card">
                    <div class="diary-banner">
                        <img src="${post.img}" alt="他人貼文照片">
                    </div>
                    <div class="diary-body">
                        <div class="diary-user-header">
                            <div class="diary-user-avatar">
                                <img src="${post.avatar}" alt="Avatar">
                            </div>
                            <div class="diary-user-meta">
                                <div class="diary-user-name-row">
                                    <div class="diary-user-name">${post.name}</div>
                                    <div class="like-container">
                                        <button class="big-action-btn like-btn" onclick="toggleLike(this)" aria-label="讚"></button>
                                        <span class="like-count">${post.likes}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="diary-post-text">${post.text}</div>
                    </div>
                </div>
            `;
            allList.appendChild(entry);
        });
    }
}

const PROFILE_FRIENDS = [
    { avatar: 'cute_daughter_avatar.png', name: '大女兒' },
    { avatar: 'cute_son_avatar.png', name: '大兒子' },
    { avatar: 'cute_uncle_avatar.png', name: '老李' },
    { avatar: 'cute_aunt_avatar.png', name: '陳阿姨' }
];

function renderCurrentSkills() {
    const skillTextEl = document.getElementById('skill-text');
    if (skillTextEl) {
        skillTextEl.textContent = currentSkills.join('、');
    }
    renderProfileSkills();
}

function renderProfileSkills() {
    const tagsContainer = document.getElementById('profile-skill-tags');
    if (!tagsContainer) return;
    tagsContainer.innerHTML = currentSkills.map(skill => `
        <span style="background: rgba(255, 255, 255, 0.4); color: var(--text-light); padding: 8px 18px; border-radius: 12px; font-size: 1.4rem; font-weight: 300; border: 1px solid rgba(82, 121, 111, 0.3); box-shadow: 0 2px 8px rgba(0,0,0,0.02); white-space: nowrap;">${skill}</span>
    `).join('');
}

function chooseSharePhoto() {
    const input = document.getElementById('sharewall-photo-input');
    if (input) input.click();
}

function handleSharePhotoSelect(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        selectedSharePhoto = e.target.result;
        const preview = document.getElementById('sharewall-photo-preview');
        if (preview) {
            preview.style.display = 'block';
            const img = preview.querySelector('img');
            if (img) img.src = selectedSharePhoto;
        }
    };
    reader.readAsDataURL(file);
}

function openParticipants(title, notifyGroup) {
    const avatars = GROUP_DICT[notifyGroup] || [ {emoji:'❓', name:'所有人'} ];
    const titleEl = document.getElementById('participant-event-title');
    if (titleEl) titleEl.textContent = title + " 參加者";
    
    const list = document.getElementById('participant-list');
    if (!list) return;
    list.innerHTML = '';
    
    avatars.forEach(av => {
        list.innerHTML += `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <div style="background: #e2e8f0; width: 68px; height: 68px; border-radius: 50%; border: 4px solid var(--primary); display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.15);">
                    <img src="${av.avatar}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="font-size: 1.6rem; color: #4a5568; font-weight: 900; text-align: center;">${av.name}</div>
            </div>
        `;
    });
    
    const modal = document.getElementById('participants-modal');
    if (modal) modal.style.display = 'flex';
}

function closeParticipantsModal() {
    const modal = document.getElementById('participants-modal');
    if (modal) modal.style.display = 'none';
}

/**
 * Handle "要去 / 不去" toggle in Assist page
 */
function toggleGoingStatus(btn) {
    if (btn.classList.contains('toggle-yes')) {
        // Switch to No
        btn.classList.remove('toggle-yes');
        btn.classList.add('toggle-no');
        btn.textContent = '不去';
    } else {
        // Switch to Yes
        btn.classList.remove('toggle-no');
        btn.classList.add('toggle-yes');
        btn.textContent = '要去';
    }
}

/**
 * Unified Tab Switching Logic
 */
function switchSubTab(tabId, element, contentClass) {
    document.querySelectorAll('.' + contentClass).forEach(content => {
        content.style.display = 'none';
    });
    
    const target = document.getElementById(tabId);
    if (target) {
        target.style.display = 'block';
        target.style.visibility = 'visible';
    }
    if (tabId === 'sharewall-me') {
        const wrapper = document.getElementById('sharewall-me-wrapper');
        const carousel = document.getElementById('sharewall-me-carousel');
        if (wrapper) wrapper.style.display = 'flex';
        if (carousel) {
            carousel.style.display = 'flex';
            carousel.style.visibility = 'visible';
        }
        renderMySharePosts();
    }
    
    if (element && element.parentElement) {
        const siblings = element.parentElement.querySelectorAll('.sub-nav-item');
        siblings.forEach(item => item.classList.remove('active'));
        element.classList.add('active');
    } else if (contentClass === 'assist-tab-content') {
        const pageMeet = document.getElementById('page-meet');
        if (pageMeet) {
            const marketBtn = pageMeet.querySelector('.sub-nav-item[onclick*="assist-market"]');
            const mineBtn = pageMeet.querySelector('.sub-nav-item[onclick*="assist-mine"]');
            if (marketBtn) marketBtn.classList.add('active');
            if (mineBtn) mineBtn.classList.remove('active');
        }
    }

}

function ensureSharewallMeSection() {
    const content = document.querySelector('#page-diary .content');
    if (!content) return;
    if (document.getElementById('sharewall-me')) return;

    console.log('Fallback: creating missing sharewall-me section');

    const section = document.createElement('div');
    section.id = 'sharewall-me';
    section.className = 'sharewall-section';
    section.style.display = 'block';
    section.innerHTML = `
        <h2 class="section-title">我的貼文</h2>
        <div class="sharewall-hint" style="margin: 0 auto 16px; max-width: 520px; font-size: 1.3rem; color: #526a55; text-align: center;">
            向左或向右滑動，查看我的貼文卡片。如果看不到貼文，請先重新整理頁面 (Ctrl+F5)。
        </div>
        <div id="my-post-empty" class="empty-state-card" style="display: none; margin: 16px 20px 0; padding: 24px; border-radius: 20px; background: rgba(255,255,255,0.95); box-shadow: 0 10px 30px rgba(0,0,0,0.08); color: #3f4e48; font-size: 1.5rem; text-align: center;">
            目前還沒有貼文，快去新增貼文吧！
        </div>
        <div class="sharewall-carousel-wrapper" id="sharewall-me-wrapper" style="display: block;">
            <button class="carousel-side-btn left" onclick="scrollCarousel('sharewall-me-carousel', -1)">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 6 L8 12 L15 18"></path>
                </svg>
            </button>
            <div class="sharewall-carousel-container" id="sharewall-me-carousel"></div>
            <button class="carousel-side-btn right" onclick="scrollCarousel('sharewall-me-carousel', 1)">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 6 L16 12 L9 18"></path>
                </svg>
            </button>
        </div>
    `;

    content.appendChild(section);
}

function updateMyPostEmptyState() {
    const myList = document.getElementById('sharewall-me-carousel');
    const myWrapper = document.getElementById('sharewall-me-wrapper');
    const emptyNotice = document.getElementById('my-post-empty');
    if (!myList || !myWrapper) return;
    myWrapper.style.display = 'block';
    myList.style.display = 'flex';
    if (emptyNotice) {
        emptyNotice.style.display = 'none';
    }
}

function switchAssistTab(tabId, element) {
    switchSubTab(tabId, element, 'assist-invite-content'); 
    // 邀约页面直接操作 DOM，不需要调用 renderMyAssistCards
    // (邀约卡片通过 submitNewInvite 直接添加到容器中)
}

function switchAssistSubTab(tabId, element) {
    switchSubTab(tabId, element, 'assist-tab-content');
    if (tabId === 'assist-mine-tasks') {
        renderMyAssistCards('my-assist-list-tasks');
    }
    if (tabId === 'assist-market') {
        renderAssistMarket();
    }
}

function renderMyAssistCards(containerId = 'my-assist-list') {
    const list = document.getElementById(containerId);
    if (!list) return;

    const mine = HELP_TASKS.filter(task => task.createdBy === currentUserName);
    if (mine.length === 0) {
        list.innerHTML = `
            <div style="text-align:center; color:#677477; padding:40px 20px; font-size:1.6rem;">
                你目前還沒有發送過相助卡片，點擊「新增」開始建立你的求助內容。
            </div>
        `;
        return;
    }

    list.innerHTML = mine.map(task => {
        const statusLabel = task.status === 'ongoing' ? '等待協助' : task.status === 'available' ? '等待幫忙' : '已完成';
        const helperCount = (task.helpers || []).length;
        const helperText = helperCount > 0 ? `已有${helperCount}位朋友準備協助` : '尚未有人回應';
        const helperBgColor = helperCount > 0 ? 'rgba(245, 184, 80, 0.5)' : 'rgba(0, 180, 216, 0.1)';
        const helperTextColor = helperCount > 0 ? '#333333' : '#00b4d8';
        const helperBorderColor = helperCount > 0 ? '#f6b846' : '#00b4d8';
        // If there are helpers, show orange; otherwise use status color
        const statusColor = helperCount > 0 ? '#f6b846' : (task.status === 'ongoing' ? '#f6b846' : task.status === 'available' ? '#00b4d8' : '#4b7a4b');
        const helperAvatarsHtml = helperCount > 0 ? `
            ${(task.helpers || []).map(h => `
                <div style="width: 36px; height: 36px; border-radius: 50%; overflow: hidden; border: 2px solid ${helperBorderColor}; box-shadow: 0 2px 8px rgba(0,0,0,0.12);">
                    <img src="${h.avatar}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            `).join('')}
        ` : '';
        const cardBgColor = helperCount > 0 ? 'rgba(246, 184, 70, 0.25)' : 'rgba(255, 255, 255, 0.85)';

        return `
            <div class="timeline-item">
                <div class="timeline-dot" style="background: ${statusColor};"></div>
                <div class="timeline-card${task.status === 'ongoing' ? ' task-ongoing' : ''}" style="border-color: ${statusColor}; background: ${cardBgColor};">
                    <div class="t-text" style="font-size: 1.8rem; margin-bottom: 14px; line-height: 1.1;">${task.type}</div>
                    <div class="t-line" style="font-size: 1.4rem;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8 7V3h8v4"/><rect x="4" y="7" width="16" height="13" rx="2"/></svg> ${task.date}</div>
                    <div class="t-line" style="font-size: 1.4rem;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 8a4 4 0 100 8 4 4 0 000-8z"/><path d="M12 4v2"/><path d="M12 18v2"/><path d="M4 12h2"/><path d="M18 12h2"/></svg> ${task.time}</div>
                    <div class="t-line" style="font-size: 1.4rem;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> ${task.location}</div>
                    <div style="width: 100%; margin-top: 20px; padding: 16px; background: ${helperBgColor}; border-radius: 16px;">
                        <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 8px;">
                            <div style="font-size: 1.4rem; font-weight: 700; color: ${helperTextColor};">${helperText}</div>
                            <div style="display: flex; gap: 4px;">
                                ${helperAvatarsHtml}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function scrollCarousel(containerId, direction) {
    const wrapper = document.getElementById(containerId);
    if (!wrapper) return;
    const scrollAmount = wrapper.clientWidth * 0.86;
    wrapper.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
}

/**
 * Setup navigation for the 4 core pages
 */
function resetSharewallSubTabs() {
    document.querySelectorAll('.sharewall-section').forEach(section => section.style.display = 'none');
    const sharewallAll = document.getElementById('sharewall-all');
    if (sharewallAll) sharewallAll.style.display = 'block';
    
    // Reset sub-nav active states since we are showing the default feed (which has no button now)
    const diaryNav = document.querySelector('#page-diary .sub-nav');
    if (diaryNav) {
        const items = diaryNav.querySelectorAll('.sub-nav-item');
        items.forEach(item => item.classList.remove('active'));
    }
}

function openSharewallAll() {
    resetSharewallSubTabs();
    renderAllSharePosts();
}

function switchPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        // 重置所有圖示為普通狀態
        const img = tab.querySelector('img');
        if (img) {
            const baseName = img.alt;
            img.src = baseName + '.png';
        }
    });

    const targetPage = document.getElementById(pageId);
    if(targetPage) targetPage.classList.add('active');
    
    const targetTab = document.getElementById('tab-' + pageId);
    if(targetTab) {
        targetTab.classList.add('active');
        // 設定當前選中項為「點擊後」圖示
        const img = targetTab.querySelector('img');
        if (img) {
            const baseName = img.alt;
            img.src = baseName + '-點擊後.png';
        }
    }

    if (pageId === 'page-diary') {
        resetSharewallSubTabs();
        renderAllSharePosts();
    }

    if (pageId === 'page-meet') {
        renderSkillBadges();
        document.querySelectorAll('#page-meet .sub-nav-item.active').forEach(btn => btn.classList.remove('active'));
        const marketTab = document.getElementById('assist-market');
        const mineTab = document.getElementById('assist-mine');
        if (marketTab) marketTab.style.display = 'block';
        if (mineTab) mineTab.style.display = 'none';
        switchAssistSubTab('assist-market', null);
        const marketBtn = document.querySelector('#page-meet .sub-nav-item[onclick*="assist-market"]');
        const mineBtn = document.querySelector('#page-meet .sub-nav-item[onclick*="assist-mine"]');
        if (marketBtn) marketBtn.classList.add('active');
        if (mineBtn) mineBtn.classList.remove('active');
        renderAssistMarket();
    }

    if (pageId === 'page-assist') {
        document.querySelectorAll('#page-assist .sub-nav-item').forEach(item => item.classList.remove('active'));
        switchAssistTab('assist-invites', null);
    }

    if (pageId === 'page-memes') {
        renderCompletedHelpPhotos();
    }
}

function toggleLike(btn) {
    if (!btn) return;
    const liked = btn.classList.toggle('liked');
    btn.setAttribute('aria-pressed', liked ? 'true' : 'false');
    const countEl = btn.nextElementSibling;
    if (countEl && countEl.classList.contains('like-count')) {
        let count = parseInt(countEl.textContent, 10) || 0;
        count = liked ? count + 1 : Math.max(0, count - 1);
        countEl.textContent = count;
    }
}

if (document.readyState !== 'loading') {
    openSharewallAll();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        openSharewallAll();
    });
}

/**
 * Diary Logic
 */
function saveDiary() {
    const textInput = document.getElementById('diary-text');
    if (!textInput) return;
    const text = textInput.value.trim();
    if(text === '') {
        showToast('請先輸入一點內容喔！');
        return;
    }
    
    const myList = document.getElementById('sharewall-me-carousel');
    if (!myList) return;
    const photoSrc = selectedSharePhoto || 'https://images.unsplash.com/photo-1517457373958-b7bdd24a6ad5?auto=format&fit=crop&q=80&w=800';
    const newEntry = document.createElement('div');
    newEntry.className = 'timeline-item';
    newEntry.style.paddingLeft = '0';
    newEntry.innerHTML = `
        <div class="diary-post-card">
            <div class="diary-banner">
                <img src="${photoSrc}" alt="Memory Photo">
            </div>
            <div class="diary-body">
                <div class="like-row">
                    <button class="big-action-btn like-btn" disabled aria-label="讚"></button>
                    <span class="like-count">0</span>
                </div>
                <div class="diary-post-text">${text}</div>
            </div>
        </div>
    `;
    
    myList.insertBefore(newEntry, myList.firstChild);
    updateMyPostEmptyState();
    textInput.value = '';
    selectedSharePhoto = '';
    const preview = document.getElementById('sharewall-photo-preview');
    if (preview) {
        preview.style.display = 'none';
        const img = preview.querySelector('img');
        if (img) img.src = '';
    }
    const fileInput = document.getElementById('sharewall-photo-input');
    if (fileInput) fileInput.value = '';
    showToast('貼文已成功發佈！');
}

/**
 * Assist Modal Logic
 */
function openAddAssistModal() {
    const modal = document.getElementById('add-assist-modal');
    if (modal) modal.style.display = 'flex';
}

function closeAddAssistModal() {
    const modal = document.getElementById('add-assist-modal');
    if (modal) modal.style.display = 'none';
}

function submitNewAssist() {
    const title = document.getElementById('assist-title').value.trim();
    const date = document.getElementById('assist-date').value;
    const time = document.getElementById('assist-time').value;
    const location = document.getElementById('assist-location').value.trim();
    const notify = '通知全家';

    if (!title) {
        showToast('請填寫您需要的幫助內容！');
        return;
    }

    const datetimeText = date ? `${date}${time ? ' ' + time : ''}` : (time ? time : '未指定時間');
    const locationText = location || '未指定地點';

    const newTask = {
        id: Date.now(),
        type: title,
        who: currentUserName,
        date: datetimeText,
        time: time || '未指定時間',
        location: locationText,
        status: 'available',
        avatar: 'cute_grandpa_avatar_1775137046957.png',
        helpers: [],
        createdBy: currentUserName
    };
    HELP_TASKS.unshift(newTask);

    // 清空表單
    document.getElementById('assist-title').value = '';
    document.getElementById('assist-date').value = '';
    document.getElementById('assist-time').value = '';
    const locInput = document.getElementById('assist-location');
    if (locInput) locInput.value = '';

    // 切換到我的邀約頁面
    const assistMineTab = document.querySelector('#page-meet .sub-nav-item[onclick*="assist-mine-tasks"]');
    if (assistMineTab) {
        switchAssistSubTab('assist-mine-tasks', assistMineTab);
    } else {
        switchAssistSubTab('assist-mine-tasks', null);
    }

    renderMyAssistCards('my-assist-list-tasks');
    showToast('邀約已成功發布！');
}

function submitNewInvite() {
    const title = document.getElementById('invite-title').value.trim();
    const date = document.getElementById('invite-date').value;
    const time = document.getElementById('invite-time').value;
    const location = document.getElementById('invite-location').value.trim();

    if (!title) {
        showToast('請填寫邀約標題！');
        return;
    }

    const datetimeText = date ? `${date}${time ? ' ' + time : ''}` : (time ? time : '未指定時間');
    const locationText = location || '未指定地點';

    const cardHtml = `
        <div class="timeline-item">
            <div class="timeline-dot" style="background-color: #a0aec0;"></div>
            <div class="timeline-card" style="opacity: 0.85; display: flex; flex-direction: row; align-items: flex-start; gap: 12px;">
                <div class="timeline-info" style="flex: 1;">
                    <div class="t-text" style="font-size: 1.6rem; margin-bottom: 8px; color: #e2e8f0;">${title}</div>
                    <div class="t-line"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${datetimeText}</div>
                    <div class="t-line"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> ${locationText}</div>
                </div>
                <button class="timeline-action toggled" style="background-color: #4a5568; flex-shrink: 0; margin-top: 0; min-height: 100px; min-width: 80px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 16px;" onclick="markInviteEnded(this)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 28px; height: 28px;">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span style="font-size: 1.1rem; margin-top: 8px; white-space: nowrap;">已結束</span>
                </button>
            </div>
            <div class="invite-feedback" style="display: none; margin-top: 14px; margin-left: 0; font-size: 1.4rem; line-height: 1.5; color: #166534; font-weight: 700;">
                因為有你，多了陪伴!
            </div>
        </div>
    `;

    const mineList = document.querySelector('#assist-mine .timeline-container');
    if (!mineList) return;

    const temp = document.createElement('div');
    temp.innerHTML = cardHtml;
    mineList.insertBefore(temp.firstElementChild, mineList.firstChild);

    document.getElementById('invite-title').value = '';
    document.getElementById('invite-date').value = '';
    document.getElementById('invite-time').value = '';
    document.getElementById('invite-location').value = '';

    const mineTabBtn = document.querySelector('#page-assist .sub-nav-item[onclick*="assist-mine"]');
    if (mineTabBtn) switchAssistTab('assist-mine', mineTabBtn);
    else switchAssistTab('assist-mine', null);

    showToast('邀約已成功發布！');
}

// ==========================================
// Login Flow Logic
// ==========================================

let loginStream = null;
const SKIP_FACE_SCAN = false; // Toggle this to true to disable camera login and enter the app directly

async function initLogin() {
    if (SKIP_FACE_SCAN) {
        console.log('Face scan disabled. Bypassing login.');
        completeLogin();
        return;
    }

    const video = document.getElementById('login-video');
    if (!video) return;

    try {
        loginStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' }, 
            audio: false 
        });
        video.srcObject = loginStream;
        
        setTimeout(() => {
            analyzeStory();
        }, 4000); 
        
    } catch (err) {
        console.error("Camera access denied:", err);
        const placeholder = document.getElementById('camera-placeholder');
        const skipBtn = document.getElementById('login-skip-btn');
        const subtitle = document.getElementById('scan-subtitle');
        const title = document.getElementById('scan-title');
        
        if (placeholder) placeholder.style.display = 'flex';
        if (skipBtn) skipBtn.style.display = 'flex';
        if (title) title.textContent = '環境不支援攝像頭';
        if (subtitle) subtitle.innerHTML = '瀏覽器安全性限制，請點擊下方按鈕或<br>使用 VS Code Live Server 開啟';
        
        showToast("檢測到瀏覽器限制，已啟動模擬模式");
    }
}

function analyzeStory() {
    if (loginStream) {
        loginStream.getTracks().forEach(track => track.stop());
    }
    
    const scanPage = document.getElementById('login-scan');
    const analysisPage = document.getElementById('login-analysis');
    if (scanPage) scanPage.style.display = 'none';
    if (analysisPage) analysisPage.style.display = 'flex';
    
    const messages = [
        { text: '正在讀取歲月痕跡...' },
        { text: '偵測到深厚的家族情感...' },
        { text: '回憶起與好友泡茶的時光...' },
        { text: '分析完成：勤奮踏實的一生。' }
    ];
    
    const container = document.getElementById('analysis-messages');
    if (!container) return;
    container.innerHTML = '';
    let delay = 0;
    
    messages.forEach((msg, index) => {
        setTimeout(() => {
            const msgEl = document.createElement('div');
            msgEl.className = 'analysis-msg';
            msgEl.style.whiteSpace = 'nowrap';
            msgEl.innerHTML = `${msg.text}`;
            container.appendChild(msgEl);
            
            if (index === messages.length - 1) {
                setTimeout(showConfirm, 2000);
            }
        }, delay);
        delay += 1500;
    });
}

function showConfirm() {
    renderCurrentSkills();
    const storyTextEl = document.getElementById('story-text');
    if (storyTextEl) storyTextEl.textContent = currentStoryText;

    const analysisPage = document.getElementById('login-analysis');
    const confirmPage = document.getElementById('login-confirm');
    const editArea = document.getElementById('profile-edit-area');
    if (analysisPage) analysisPage.style.display = 'none';
    if (confirmPage) confirmPage.style.display = 'flex';
    if (editArea) editArea.style.display = 'none';
}

function startEditProfile() {
    const editArea = document.getElementById('profile-edit-area');
    const viewArea = document.getElementById('profile-view-area');
    const skillInput = document.getElementById('skill-edit-input');
    const storyInput = document.getElementById('story-edit-input');
    if (!editArea || !viewArea || !skillInput || !storyInput) return;

    skillInput.value = currentSkills.join('、');
    storyInput.value = currentStoryText;
    viewArea.style.display = 'none';
    editArea.style.display = 'block';
    skillInput.focus();
}

function saveEditedProfile() {
    const skillTextEl = document.getElementById('skill-text');
    const storyTextEl = document.getElementById('story-text');
    const editArea = document.getElementById('profile-edit-area');
    const viewArea = document.getElementById('profile-view-area');
    const skillInput = document.getElementById('skill-edit-input');
    const storyInput = document.getElementById('story-edit-input');
    if (!skillTextEl || !storyTextEl || !editArea || !viewArea || !skillInput || !storyInput) return;

    const skillValue = skillInput.value.trim();
    const storyValue = storyInput.value.trim();
    if (skillValue) {
        currentSkills = skillValue.split(/[、,，]+/).map(s => s.trim()).filter(Boolean);
        skillTextEl.textContent = currentSkills.join('、');
        renderProfileSkills();
    }
    if (storyValue) {
        currentStoryText = storyValue;
        storyTextEl.textContent = currentStoryText;
    }

    editArea.style.display = 'none';
    viewArea.style.display = 'block';
    showToast('已更新資料');
}

function cancelEditProfile() {
    const editArea = document.getElementById('profile-edit-area');
    const viewArea = document.getElementById('profile-view-area');
    if (!editArea || !viewArea) return;
    editArea.style.display = 'none';
    viewArea.style.display = 'block';
}

function playLoginConfirmSound() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    setTimeout(() => {
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
    }, 50);

    setTimeout(() => {
        osc.stop();
        ctx.close();
    }, 220);
}

function goToCalendar() {
    const confirmPage = document.getElementById('login-confirm');
    const calendarPage = document.getElementById('login-calendar');
    if (confirmPage) confirmPage.style.display = 'none';
    if (calendarPage) calendarPage.style.display = 'flex';
    
    const loginMain = document.getElementById('page-login');
    if (loginMain) loginMain.classList.add('calendar-layout');
    
    updateCalendarDate();
    initCalendarSwipe();
}

function tearCalendar() {
    const calendar = document.getElementById('calendar-tear-trigger');
    const leaf = document.getElementById('calendar-leaf');
    if (!calendar || calendar.classList.contains('tearing')) return;
    
    calendar.classList.add('tearing');
    if (leaf) leaf.style.transform = '';
    
    setTimeout(() => {
        completeLogin();
    }, 400); 
}

function initCalendarSwipe() {
    const trigger = document.getElementById('calendar-tear-trigger');
    const leaf = document.getElementById('calendar-leaf');
    if (!trigger || !leaf) return;

    let startX = 0, startY = 0, currentX = 0, currentY = 0, isDragging = false;
    const threshold = 120;

    const handleStart = (e) => {
        if (trigger.classList.contains('tearing')) return;
        isDragging = true;
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        startX = clientX;
        startY = clientY;
        leaf.style.transition = 'none';
    };

    const handleMove = (e) => {
        if (!isDragging) return;
        currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        currentY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        const deltaY = startY - currentY;
        const deltaX = currentX - startX;

        if (deltaY > 0) {
            const rotationX = Math.min(deltaY / 1.3, 120);
            const rotationY = Math.min(Math.max(deltaX / 12, -15), 15);
            const rotationZ = Math.min(Math.max(deltaX / 25, -5), 5);
            const translationY = Math.min(deltaY / 2, 120);
            const scaleFactor = 1 + Math.min(deltaY / 1200, 0.1);
            const currentRadius = 12 + Math.min(deltaY / 8, 100); 
            
            leaf.style.borderRadius = `12px 12px ${currentRadius}px ${currentRadius}px`;
            leaf.style.transform = `rotateX(${-rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg) translateY(${-translationY}px) scaleX(${scaleFactor})`;
            
            const shine = document.getElementById('leaf-shine');
            if (shine) {
                shine.style.opacity = Math.min(deltaY / 150, 0.8);
                const shinePos = Math.min(deltaY / 2, 95);
                shine.style.background = `linear-gradient(to bottom, transparent, rgba(255,255,255,0.5) ${shinePos}%, transparent)`;
            }

            const shadowDepth = Math.min(deltaY / 2.5, 60);
            const shadowBlur = Math.min(deltaY / 1.5, 80);
            const shadowOpacity = Math.min(deltaY / 400, 0.2);
            leaf.style.boxShadow = `0 ${shadowDepth}px ${shadowBlur}px rgba(0,0,0,${shadowOpacity})`;
            
            if (e.cancelable) e.preventDefault();
        }
    };

    const handleEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        const deltaY = startY - currentY;
        const shine = document.getElementById('leaf-shine');

        if (deltaY > threshold) {
            tearCalendar();
        } else {
            leaf.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-radius 0.4s ease';
            leaf.style.transform = '';
            leaf.style.boxShadow = '';
            leaf.style.borderRadius = '12px';
            if (shine) shine.style.opacity = '0';
        }
    };

    trigger.addEventListener('touchstart', handleStart, { passive: false });
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    trigger.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
}

function completeLogin() {
    playLoginConfirmSound();
    switchPage('page-diary');
    const loginPage = document.getElementById('page-login');
    if (loginPage) loginPage.classList.remove('active');
    
    // Initialize app content after successful login
    resetSharewallSubTabs();
    renderMySharePosts();
    renderAllSharePosts();
}

function updateCalendarDate() {
    const now = new Date();
    const yearEl = document.getElementById('cal-year');
    if (yearEl) yearEl.textContent = now.getFullYear();
    
    const monthsCn = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
    const monthCnEl = document.getElementById('cal-month-cn');
    if (monthCnEl) monthCnEl.textContent = monthsCn[now.getMonth()] + '月';
    
    const dayEl = document.getElementById('cal-day');
    if (dayEl) dayEl.textContent = now.getDate().toString().padStart(2, '0');
    
    const weekdayEl = document.getElementById('cal-weekday');
    if (weekdayEl) weekdayEl.textContent = now.toLocaleString('zh-TW', { weekday: 'long' });
    
    const lunarEl = document.getElementById('cal-lunar-vert');
    if (lunarEl) {
        try {
            const lunarFormatter = new Intl.DateTimeFormat('zh-TW-u-ca-chinese', { dateStyle: 'long' });
            let lunarRaw = lunarFormatter.format(now);
            let lunarDate = lunarRaw.split('年')[1] || lunarRaw;
            lunarEl.textContent = '農曆' + lunarDate.trim();
        } catch (e) { console.warn("Lunar error", e); }
    }
}

function updateDiaryDate() {
    const now = new Date();
    const monthsCn = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
    const numCn = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    
    const toCnDate = (num) => {
        if (num <= 10) return numCn[num];
        if (num < 20) return '十' + (num % 10 === 0 ? '' : numCn[num % 10]);
        if (num % 10 === 0) return numCn[Math.floor(num / 10)] + '十';
        return numCn[Math.floor(num / 10)] + '十' + numCn[num % 10];
    };

    const diaryDateEl = document.getElementById('diary-date');
    if (diaryDateEl) {
        const m = monthsCn[now.getMonth()] + '月';
        const d = toCnDate(now.getDate()) + '日';
        const w = now.toLocaleString('zh-TW', { weekday: 'long' });
        diaryDateEl.textContent = `${m}${d} ${w}`;
    }
}

/**
 * Meme Generator Logic
 */
function insertMemeText(text) {
    const input = document.getElementById('meme-text-input');
    if (!input) return;
    if (input.value) input.value += '\n' + text;
    else input.value = text;
    updateMemePreviewText();
}

function updateMemePreviewText() {
    const input = document.getElementById('meme-text-input');
    const previewText = document.getElementById('meme-preview-text');
    const vPosInput = document.getElementById('meme-pos-vertical');
    const fSizeInput = document.getElementById('meme-font-size');

    if (!input || !previewText || !vPosInput || !fSizeInput) return;

    const text = input.value;
    const vPos = vPosInput.value;
    const fSize = fSizeInput.value;

    previewText.innerHTML = text.replace(/\n/g, '<br>');
    previewText.style.top = vPos + '%';
    previewText.style.fontSize = fSize + 'rem';
    // Ensure fixed positioning during updates
    previewText.style.transform = 'translateY(-50%)';
}

function previewMemeImage(input) {
    const container = document.getElementById('meme-preview-container');
    const img = document.getElementById('meme-preview-img');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
            if (container) container.style.display = 'block';
            updateMemePreviewText();
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function openShareModal() {
    const img = document.getElementById('meme-preview-img');
    if (!img || !img.src || img.src.includes('index.html') || img.src === window.location.href) {
        showToast("還沒有選擇照片喔！");
        return;
    }
    const modal = document.getElementById('share-modal');
    if (modal) modal.style.display = 'flex';
}

function closeShareModal() {
    const modal = document.getElementById('share-modal');
    if (modal) modal.style.display = 'none';
    document.querySelectorAll('.friend-item.selected').forEach(item => item.classList.remove('selected'));
}

function toggleFriendSelection(element) {
    element.classList.toggle('selected');
}

function confirmSendMeme() {
    const selectedItems = document.querySelectorAll('.friend-item.selected');
    if (selectedItems.length === 0) {
        showToast("還沒有選擇發送對象喔！");
        return;
    }
    showToast("已成功發送！");
    closeShareModal();
}

/**
 * Notifications & Profile
 */
function openNotifications() {
    document.querySelectorAll('.notif-badge').forEach(badge => badge.style.display = 'none');
    const modal = document.getElementById('notifications-modal');
    if (modal) modal.style.display = 'flex';
}

function markAsRead(item) {
    if (!item) return;
    item.classList.remove('unread');

    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    if (unreadCount === 0) {
        document.querySelectorAll('.notif-badge').forEach(badge => badge.style.display = 'none');
    }
}

function closeNotificationsModal() {
    const modal = document.getElementById('notifications-modal');
    if (modal) modal.style.display = 'none';
}

function openProfile() {
    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.style.display = 'flex';
        renderProfileSkills();
        renderProfileHelpHistory();
    }
}
function closeProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) modal.style.display = 'none';
}

function renderAssistMarket() {
    const list = document.getElementById('market-list');
    if (!list) return;
    list.innerHTML = '';
    const favoriteSet = new Set(favoriteFriends);
    const sortedTasks = HELP_TASKS
        .filter(t => t.status !== 'done' && t.createdBy !== currentUserName)
        .sort((a, b) => {
            const aFav = favoriteSet.has(a.who) ? 1 : 0;
            const bFav = favoriteSet.has(b.who) ? 1 : 0;
            if (aFav !== bFav) return bFav - aFav;
            return a.id - b.id;
        });

    sortedTasks.forEach(task => {
        const isOngoing = task.status === 'ongoing';
        const helpers = task.helpers || [];
        const userHelping = helpers.some(h => h.name === currentUserName);
        const showFinishButton = isOngoing && userHelping;
        const actionText = showFinishButton ? '已完成' : (isOngoing ? (userHelping ? '你在幫忙' : '我也可以幫忙') : '我可以幫忙');
        const buttonDisabled = userHelping && !showFinishButton ? 'disabled' : '';
        const buttonStyle = showFinishButton ? 'background: #4b7a4b; color: #fff;' : (userHelping ? 'opacity: 0.65; cursor: not-allowed;' : '');
        const buttonOnclick = showFinishButton ? `finishTask(${task.id})` : `acceptTask(${task.id})`;
        const statusColor = isOngoing ? '#f6b846' : '#00b4d8';
        const cardStyle = isOngoing ? 'background: rgba(246, 184, 70, 0.14); border-color: #f6b846;' : '';
        const helperLabel = helpers.length > 0 ? (userHelping ? `${helpers.length === 1 ? '你正在幫忙' : '你和 ' + (helpers.length - 1) + ' 位朋友正在幫忙'}` : `${helpers.length} 位朋友正在幫忙`) : '';
        const helperAvatars = helpers.length > 0 ? `
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 12px; flex-wrap: wrap;">
                <div style="font-size: 1.3rem; font-weight: 700; color: #4a5568; white-space: nowrap;">${helperLabel}</div>
                ${helpers.map(h => `
                    <div style="width: 36px; height: 36px; border-radius: 50%; overflow: hidden; border: 2px solid ${statusColor}; box-shadow: 0 2px 8px rgba(0,0,0,0.12);">
                        <img src="${h.avatar}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                `).join('')}
            </div>
        ` : '';
        const isFavorite = favoriteSet.has(task.who);
        const favoriteButton = `
            <button class="favorite-btn" onclick="toggleFavoriteFriend('${task.who}')" style="background: transparent; border: none; color: ${isFavorite ? '#f87171' : '#94a3b8'}; font-size: 1.9rem; cursor: pointer; padding: 0; margin: 0; flex-shrink: 0;">
                ${isFavorite ? '♥' : '♡'}
            </button>
        `;
        const favoriteBadge = isFavorite ? `<div style="font-size: 1.2rem; color: #f6b846; font-weight: 700; margin-top: 8px;">最愛好友</div>` : '';

        list.innerHTML += `
            <div class="timeline-item">
                <div class="timeline-dot" style="background: ${statusColor};"></div>
                <div class="timeline-card${isOngoing ? ' task-ongoing' : ''}" style="${cardStyle}">
                    <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
                        <img src="${task.avatar}" style="width: 56px; height: 56px; border-radius: 50%; border: 3px solid ${statusColor}; object-fit: cover; flex-shrink: 0;">
                        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex: 1; min-width: 0;">
                            <div style="min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 4px;">
                                <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                                    <div style="font-size: 1.8rem; font-weight: 900; color: #333; overflow-wrap: break-word; min-width: 0;">${task.who}</div>
                                    ${favoriteButton}
                                    ${isFavorite ? `<span style="font-size: 1.2rem; color: #f87171; font-weight: 700; white-space: nowrap;">最愛好友</span>` : ''}
                                </div>
                                <div style="font-size: 1.3rem; color: #64748b; margin-top: 4px; overflow-wrap: break-word; min-width: 0;">需要幫忙</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="t-text">${task.type}</div>
                        <div class="t-line"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8 7V3h8v4"/><rect x="4" y="7" width="16" height="13" rx="2"/></svg> ${task.date}</div>
                        <div class="t-line"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${task.time}</div>
                        <div class="t-line"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> ${task.location}</div>
                    </div>
                    ${helperAvatars}
                    <button class="big-action-btn" style="${buttonStyle}" ${buttonDisabled} onclick="${buttonOnclick}">${actionText}</button>
                </div>
            </div>
        `;
    });
}

function renderOngoing() {
    const list = document.getElementById('ongoing-list');
    if (!list) return;
    list.innerHTML = '';
    const ongoing = HELP_TASKS.filter(t => t.status === 'ongoing');
    if (ongoing.length === 0) {
        list.innerHTML = '<div style="text-align: center; color: var(--text-light); padding: 40px 10px; font-size: 1.6rem; font-weight: 700;">目前沒有進行中的任務喔</div>';
        return;
    }
    ongoing.forEach(task => {
        list.innerHTML += `
            <div class="timeline-item">
                <div class="timeline-dot" style="background: #f6b846;"></div>
                <div class="timeline-card" style="border-color: #f6b846;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <img src="${task.avatar}" style="width: 56px; height: 56px; border-radius: 50%; border: 3px solid #f6b846; object-fit: cover; flex-shrink: 0;">
                        <div style="font-size: 1.8rem; font-weight: 900; color: #333; white-space: nowrap;">幫 ${task.who} 的任務</div>
                    </div>
                    <div>
                        <div class="t-text">${task.type}</div>
                        <div class="t-line"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8 7V3h8v4"/><rect x="4" y="7" width="16" height="13" rx="2"/></svg> ${task.date}</div>
                        <div class="t-line" style="color: #f6b846; font-weight: 900;">🕒 進行中...</div>
                    </div>
                    <button class="big-action-btn" style="background: #f6b846;" onclick="finishTask(${task.id})">已完成</button>
                </div>
            </div>
        `;
    });
}

function renderHistory() {
    const list = document.getElementById('history-list');
    if (!list) return;
    list.innerHTML = '';
    const historyData = HELP_TASKS.filter(t => t.status === 'done');
    if (historyData.length === 0) {
        list.innerHTML = '<div style="text-align: center; color: #999; padding: 40px; font-size: 1.6rem;">還沒有完成的紀錄喔</div>';
        return;
    }
    historyData.forEach(task => {
        list.innerHTML += `
            <div class="timeline-item" style="opacity: 0.85;">
                <div class="timeline-dot" style="background: #4b7a4b;"></div>
                <div class="timeline-card">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                        <img src="${task.avatar}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                        <div style="font-size: 1.4rem; color: #666; font-weight: 700;">與 ${task.who} 的互助</div>
                    </div>
                    <div class="t-line"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8 7V3h8v4"/><rect x="4" y="7" width="16" height="13" rx="2"/></svg> ${task.date}</div>
                    <div class="t-text" style="color: #4b7a4b;">${task.type}</div>
                </div>
            </div>
        `;
    });
}

function renderCompletedHelpPhotos() {
    const list = document.getElementById('completed-help-list');
    if (!list) return;
    const completed = HELP_TASKS.filter(t => t.status === 'done');
    if (completed.length === 0) {
        list.innerHTML = `
            <div class="meme-card" style="text-align:center; color:#677477;">
                <div style="font-size:1.6rem; font-weight:700; margin-bottom:8px;">目前尚未有完成的幫助紀錄</div>
                <div style="font-size:1.3rem;">完成一次幫助後，這裡會顯示照片式回顧與任務記錄。</div>
            </div>
        `;
        return;
    }
    list.innerHTML = completed.map(task => `
        <div class="meme-card">
            <div class="meme-image" style="position:relative; overflow:hidden; background: linear-gradient(180deg, rgba(74, 119, 124, 0.15), rgba(74, 119, 124, 0.05)), url('${task.avatar}') center / cover no-repeat;">
                <div class="meme-text" style="position:absolute; top:16px; left:16px; right:16px; text-align:left; font-size:1.8rem; color:#314c44; text-shadow:none;">完成：${task.type}</div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
                <div>
                    <div style="font-size:1.7rem; font-weight:900; color:#1b4332;">${task.who}</div>
                    <div style="font-size:1.3rem; color:#51646a;">${task.date} • ${task.location}</div>
                </div>
                <div style="font-size:1.1rem; color:#4b7a4b; font-weight:900; background: rgba(75,122,75,0.14); padding: 8px 12px; border-radius: 14px;">已完成</div>
            </div>
        </div>
    `).join('');
}

function renderProfileHelpHistory() {
    const container = document.getElementById('profile-help-history-list');
    if (!container) return;
    const completedHelps = HELP_TASKS.filter(task => task.status === 'done' && (task.helpers || []).some(h => h.name === currentUserName));
    if (completedHelps.length === 0) {
        container.innerHTML = `
            <div style="padding: 18px 16px; border-radius: 18px; background: rgba(255,255,255,0.7); border: 1px solid rgba(82,121,111,0.16); color: #4a5568; font-size: 1.4rem;">
                你還沒有完成的幫助紀錄，完成一次協助後這裡會出現回顧。
            </div>
        `;
        return;
    }
    container.innerHTML = completedHelps.map(task => `
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 18px; background: rgba(243, 246, 255, 0.9); border: 1px solid rgba(124, 179, 255, 0.24);">
            <div style="display:flex; align-items:center; gap: 12px; min-width: 0;">
                <img src="${task.avatar}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; flex-shrink: 0;">
                <div style="min-width:0;">
                    <div style="font-size: 1.45rem; font-weight: 800; color: #1f2937; overflow-wrap: break-word;">${task.type}</div>
                    <div style="font-size: 1.2rem; color: #475569;">${task.who} • ${task.date}</div>
                </div>
            </div>
            <span style="font-size: 1.2rem; color: #2563eb; font-weight: 700; background: rgba(37, 99, 235, 0.12); padding: 6px 12px; border-radius: 999px; white-space: nowrap;">已完成</span>
        </div>
    `).join('');
}

function renderSkillBadges() {
    const badges = document.getElementById('skill-badges');
    if (!badges) return;
    badges.innerHTML = '';
    const entries = Object.entries(USER_SKILLS);
    entries.forEach(([skill, count], idx) => {
        badges.innerHTML += `
            <span style="color: var(--text-light); font-size: 1.4rem; font-weight: 700;">
                ${skill} ×${count}${idx < entries.length - 1 ? ' ・ ' : ''}
            </span>
        `;
    });
}

function acceptTask(id) {
    const task = HELP_TASKS.find(t => t.id === id);
    if (!task) return;
    task.helpers = task.helpers || [];
    const alreadyHelping = task.helpers.some(h => h.name === currentUserName);
    if (alreadyHelping) {
        showToast('你已在幫忙這個任務！');
        return;
    }

    task.status = 'ongoing';
    task.helpers.push({ name: currentUserName, avatar: 'cute_grandpa_avatar_1775137046957.png' });
    renderAssistMarket();
    showToast('你已加入幫忙！');
}

function toggleFavoriteFriend(name) {
    if (!name) return;
    const index = favoriteFriends.indexOf(name);
    if (index === -1) {
        favoriteFriends.push(name);
        showToast(`${name} 已加入最愛！`);
    } else {
        favoriteFriends.splice(index, 1);
        showToast(`${name} 已從最愛移除`);
    }
    renderAssistMarket();
}

function finishTask(id) {
    const task = HELP_TASKS.find(t => t.id === id);
    if (task) {
        task.status = 'done';
        let key = task.type.includes('散步') ? '陪散步' : (task.type.includes('買') ? '代買' : '生活協助');
        USER_SKILLS[key] = (USER_SKILLS[key] || 0) + 1;
        document.getElementById('feedback-modal').style.display = 'flex';
        renderSkillBadges();
        renderAssistMarket();
        renderCompletedHelpPhotos();
        renderProfileHelpHistory();
        showToast('已標記為已完成！');
    }
}

function closeFeedbackModal() {
    document.getElementById('feedback-modal').style.display = 'none';
}

window.openDetailList = function(type) {
    const titleEl = document.getElementById('detail-list-title');
    const containerEl = document.getElementById('detail-list-container');
    const modal = document.getElementById('detail-list-modal');
    if (!modal) return;

    const items = type === 'friends'
        ? PROFILE_FRIENDS
        : HELP_TASKS.filter(task => task.status === 'done' && (task.helpers || []).some(h => h.name === currentUserName)).map(task => ({
            avatar: task.avatar,
            name: task.who,
            label: `${task.type} • ${task.date}`
        }));

    titleEl.innerText = type === 'helped' ? '幫助過的人' : '親密好友';
    containerEl.innerHTML = items.length === 0 ?
        `<div style="color: #64748b; font-size: 1.5rem; text-align: center; padding: 28px 12px;">目前還沒有名單喔</div>` :
        items.map(item => `
            <div style="display:flex; align-items:center; gap: 14px; padding: 14px 16px; border-radius: 18px; background: rgba(255,255,255,0.95); border: 1px solid rgba(226,232,240,0.9);">
                <div style="width: 54px; height: 54px; border-radius: 50%; overflow:hidden; flex-shrink:0; border: 2px solid rgba(74, 119, 124, 0.15);">
                    <img src="${item.avatar}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="min-width:0;">
                    <div style="font-size: 1.6rem; font-weight: 800; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
                    ${item.label ? `<div style="font-size: 1.2rem; color: #64748b; margin-top: 2px;">${item.label}</div>` : ''}
                </div>
            </div>
        `).join('');

    modal.style.display = 'flex';
};

window.closeDetailList = function() {
    const modal = document.getElementById('detail-list-modal');
    if(modal) modal.style.display = 'none';
};

/**
 * Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    updateDiaryDate();
    updateCalendarDate();

    if (SKIP_FACE_SCAN) {
        const loginPage = document.getElementById('page-login');
        const diaryPage = document.getElementById('page-diary');
        const diaryTab = document.getElementById('tab-page-diary');
        if (loginPage) loginPage.classList.remove('active');
        if (diaryPage) diaryPage.classList.add('active');
        if (diaryTab) diaryTab.classList.add('active');
        resetSharewallSubTabs();
        renderMySharePosts();
        renderAllSharePosts();
        console.log('SKIP_FACE_SCAN is active: directly entering app.');
        return;
    }

    if (document.getElementById('page-login').classList.contains('active')) {
        initLogin();
    }
});
