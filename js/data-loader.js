document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("data.json");
        const data = await response.json();
        window.modelData = data;

        if (data.website_title) {
            document.title = data.website_title;
        }

        const navLogo = document.querySelector('.nav__logo');
        if (navLogo) {
            navLogo.textContent = data.navbar_text || data.hero?.name || data.customer_name || 'Niki.';
        }

        const footerText = document.querySelector('footer p');
        if (footerText) {
            footerText.innerHTML = data.footer?.text || `${data.hero?.name || data.customer_name || 'Niki.'}. ♡`;
        }

        if (data.hero) {
            document.querySelector(".hero__badge span").textContent = data.hero.badge;
            const lines = document.querySelectorAll(".hero__headline .line");
            if (lines.length > 0) lines[0].innerHTML = data.hero.title1;
            if (lines.length > 1) lines[1].innerHTML = data.hero.title2;
            document.querySelector(".hero__sub").textContent = data.hero.sub;
        }

        if (data.timeline) {
            document.querySelector(".timeline .section-header__eyebrow").textContent = data.timeline.eyebrow;
            document.querySelector(".timeline .section-header__title").innerHTML = data.timeline.title;
            document.querySelector(".timeline .section-header__desc").textContent = data.timeline.desc;

            const timelineContainer = document.querySelector(".timeline__items");
            if (timelineContainer) {
                timelineContainer.innerHTML = "";
                data.timeline.items.forEach((item, i) => {
                    const el = document.createElement("div");
                    el.className = `timeline__item timeline__item--${i % 2 === 0 ? "left" : "right"}`;
                    el.innerHTML = `
                        <div class="timeline__icon">${item.icon}</div>
                        <div class="timeline__card glass-card">
                            <span class="timeline__date">${item.date}</span>
                            <h3 class="timeline__title">${item.title}</h3>
                            <p class="timeline__quote">${item.quote}</p>
                        </div>
                    `;
                    timelineContainer.appendChild(el);
                });
            }
        }

        if (data.gallery) {
            document.querySelector(".gallery .section-header__eyebrow").textContent = data.gallery.eyebrow;
            document.querySelector(".gallery .section-header__title").innerHTML = data.gallery.title;
            document.querySelector(".gallery .section-header__desc").textContent = data.gallery.desc;

            const quoteEl = document.querySelector(".gallery .t-quote");
            if (quoteEl) quoteEl.innerHTML = data.gallery.quote;

            const galleryGrid = document.querySelector(".gallery__grid");
            if (galleryGrid) {
                galleryGrid.innerHTML = "";
                data.gallery.items.forEach((item, i) => {
                    const card = document.createElement("div");
                    card.className = "gallery__card";
                    card.setAttribute("data-reveal", "fade-up");

                    const photoSrc = item.photo ? item.photo : `assets/images/img${i + 1}.jpeg`;
                    card.innerHTML = `
                        <div class="gallery__card-inner">
                            <img class="gallery__photo" src="${photoSrc}" alt="${item.caption}" loading="lazy" />
                            <div class="gallery__caption">
                                <span class="gallery__caption-text">${item.caption}</span>
                                <span class="gallery__caption-tag">#${item.tag}</span>
                            </div>
                        </div>
                    `;
                    galleryGrid.appendChild(card);
                });
            }
        }

        if (data.letter) {
            document.querySelector(".love-letter .section-header__eyebrow").textContent = data.letter.eyebrow;
            document.querySelector(".love-letter .section-header__title").innerHTML = data.letter.title;

            document.querySelector(".letter__salutation").textContent = data.letter.salutation;

            const letterBody = document.querySelector(".letter__body");
            if (letterBody) {
                letterBody.innerHTML = "";
                data.letter.paragraphs.forEach(p => {
                    const pEl = document.createElement("p");
                    pEl.innerHTML = p; // Using innerHTML because it allows <strong>
                    letterBody.appendChild(pEl);
                });
            }

            document.querySelector(".letter__sign").textContent = data.letter.signature;
        }

        if (data.finale) {
            document.querySelector(".finale__quote").innerHTML = data.finale.quote;
            document.querySelector(".finale__sub").innerHTML = data.finale.sub;
        }

        if (data.passcode) {
            if (window.CONFIG && window.CONFIG.passcode) {
                if (data.passcode.code) window.CONFIG.passcode.code = String(data.passcode.code);
                if (data.passcode.hint) window.CONFIG.passcode.hint = String(data.passcode.hint);
            }
            if (data.passcode.title) {
                const titleEl = document.querySelector(".passcode__title");
                if (titleEl) titleEl.textContent = data.passcode.title;
            }
            if (data.passcode.desc) {
                const descEl = document.querySelector(".passcode__desc");
                if (descEl) descEl.textContent = data.passcode.desc;
            }
        }

        // Update Audio System Playlist
        if (data.music && window.AudioSystem && window.AudioSystem.setPlaylist) {
            window.AudioSystem.setPlaylist([{
                id: "song1",
                title: data.music.title || data.customer_name || "For You",
                artist: data.music.artist || "With Love",
                file: data.music.song || "music/song1.mp3",
                cover: data.music.cover || "assets/music-cover/song1.jpeg",
                startTime: 0,
                endTime: null,
                loopStart: null,
                volume: 0.75,
                loop: true,
                fadeIn: 2.5,
                fadeOut: 2.0
            }]);
        }

    } catch (e) {
        console.error("Failed to load data.json", e);
    }
});
