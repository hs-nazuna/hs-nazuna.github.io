// ページの読み込みが完了したら実行
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage();
});

/**
 * 言語設定関数
 * @param {string} lang - 'ja' または 'en'
 */
function setLanguage(lang) {
    if (lang !== 'ja' && lang !== 'en') {
        lang = 'en'; // 不正な値の場合は英語にフォールバック
    }
    document.documentElement.lang = lang;
    localStorage.setItem('userLanguage', lang);
}

/**
 * ページの初回読み込み時に言語を初期化する
 */
function initializeLanguage() {
    // 1. 保存された言語設定を取得
    const savedLang = localStorage.getItem('userLanguage');
    const browserLang = navigator.language.split('-')[0];
    let defaultLang = 'en'; // デフォルトは英語
    if (savedLang) {
        // 保存された設定があれば最優先
        defaultLang = savedLang;
    } else if (browserLang === 'ja') {
        // ブラウザが日本語なら日本語を優先
        defaultLang = 'ja';
    }
    setLanguage(defaultLang);
}

/**
 * 指定されたURLからHTMLを読み込み、指定された要素に挿入する
 * @param {string} url - 読み込むHTMLのURL
 * @param {string} elementId - 挿入先の要素ID
 */
function loadHTML(url, elementId) {
  fetch(url)
    .then(response => response.text())
    .then(html => {
      document.getElementById(elementId).innerHTML = html;
    })
    .catch(err => console.error('Failed to load HTML:', err));
}

// フッターの著作権年を動的に設定する関数
function setCopyrightYear() {
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
}

/**
 * publications を表示する関数
 */
function displayPublications(jsonPath, targets) {
    const table_dict = {}
    for (const key of targets) {
        table_dict[key] = document.getElementById(key);
    }

    fetch(jsonPath)
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        data.forEach(pub => {
            if (pub.note == "Example") return; // Exampleはスキップ
            const table = table_dict[pub.type];
            const item = document.createElement('tr');
            const index = document.createElement('td');
            const content = document.createElement('td');

            // インデックスの設定
            index.textContent = `${table.rows.length + 1}.`;
            index.style.paddingRight = "10px";
            
            // 著者
            const author = document.createElement('span');
            author.textContent = pub.author;
            content.appendChild(author);
            content.appendChild(document.createElement('br'));

            // タイトル
            if (pub.url) {
                const link = document.createElement('a');
                link.href = pub.url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.textContent = `\"${pub.title}\"`;
                content.appendChild(link);
            }
            else {
                const title = document.createElement('span');
                title.textContent = `\"${pub.title}\"`;
                content.appendChild(title);
            }
            content.appendChild(document.createElement('br'));

            // 雑誌名・会議名・その他
            const where_elem = document.createElement('span');
            where_elem.textContent = pub.where;
            content.appendChild(where_elem);
            content.appendChild(document.createTextNode(", "));

            // 発行年月
            const date = document.createElement('span');
            if (pub.lang == "ja") {
                if (pub.year) date.textContent += pub.year + "年";
                if (pub.month) date.textContent += pub.month + "月";
            }
            else {
                if (pub.month) date.textContent += pub.month + " ";
                if (pub.year) date.textContent += pub.year;
            }
            content.appendChild(date);

            // ノート
            if (pub.note) {
                content.appendChild(document.createTextNode(", "));
                const note = document.createElement('span');
                note.textContent = `(${pub.note})`;
                content.appendChild(note);
            }

            // その他 URL
            if (pub.urls) {
                content.appendChild(document.createElement('br'));
                if (pub.urls.full) {
                    const fullLink = document.createElement('a');
                    fullLink.href = pub.urls.full;
                    fullLink.target = "_blank";
                    fullLink.rel = "noopener noreferrer";
                    fullLink.textContent = "[Full Version]";
                    content.appendChild(fullLink);
                    content.appendChild(document.createTextNode(" "));
                }
                if (pub.urls.slide) {
                    const slideLink = document.createElement('a');
                    slideLink.href = pub.urls.slide;
                    slideLink.target = "_blank";
                    slideLink.rel = "noopener noreferrer";
                    slideLink.textContent = "[Slide]";
                    content.appendChild(slideLink);
                    content.appendChild(document.createTextNode(" "));
                }
                if (pub.urls.code) {
                    const codeLink = document.createElement('a');
                    codeLink.href = pub.urls.code;
                    codeLink.target = "_blank";
                    codeLink.rel = "noopener noreferrer";
                    codeLink.textContent = "[Code]";
                    content.appendChild(codeLink);
                }
            }

            item.appendChild(index);
            item.appendChild(content);
            table.appendChild(item);
        });
    })
    .catch(error => {
        console.error("error", error);
    });
}
