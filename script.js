/* ===================================
   FormSend - Combined JavaScript
   All scripts from all HTML pages
   =================================== */

// ============ index.html ============

// Dropdown toggle functionality
function toggleDropdown(element) {
    const dropdown = element.parentElement;
    const menu = dropdown.querySelector('.dropdown-menu');
    
    // Close all other dropdowns
    document.querySelectorAll('.custom-dropdown').forEach(d => {
        if (d !== dropdown) {
            d.querySelector('.dropdown-toggle').classList.remove('active');
            d.querySelector('.dropdown-menu').classList.remove('show');
        }
    });
    
    // Toggle current dropdown
    element.classList.toggle('active');
    menu.classList.toggle('show');
}

// Select option from dropdown
function selectOption(element) {
    const menu = element.parentElement;
    const dropdown = menu.parentElement;
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const text = dropdown.querySelector('.dropdown-text');
    
    // Remove selected class from all items
    menu.querySelectorAll('.dropdown-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Add selected class to clicked item
    element.classList.add('selected');
    
    // Update toggle text
    text.textContent = element.textContent;
    
    // Close dropdown with animation
    setTimeout(() => {
        toggle.classList.remove('active');
        menu.classList.remove('show');
    }, 150);
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-dropdown')) {
        document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
            toggle.classList.remove('active');
        });
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

// Switch active location card
function activateCard(element) {
    const cards = document.querySelectorAll('.location-card');
    cards.forEach(card => card.classList.remove('active'));
    element.classList.add('active');

    const city = element.querySelector('h3').innerText.split(',')[0];
    const mapText = document.querySelector('.map-section .map-pin span');
    if(mapText) {
        mapText.innerText = city + " Business District";
    }
}

// Form input animations
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.querySelector('label').style.color = '#2563EB';
        });
        input.addEventListener('blur', () => {
            input.parentElement.querySelector('label').style.color = '#111827';
        });
    });

    const navToggles = document.querySelectorAll('.has-dropdown > a');
    navToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const parent = toggle.parentElement;
            const isOpen = parent.classList.contains('is-open');
            const scope = parent.closest('nav') || document;

            scope.querySelectorAll('.has-dropdown.is-open').forEach(item => {
                if (item !== parent) {
                    item.classList.remove('is-open');
                }
            });

            parent.classList.toggle('is-open', !isOpen);
        });
    });

    document.querySelectorAll('.nav-dropdown a').forEach(link => {
        link.addEventListener('click', () => {
            const parent = link.closest('.has-dropdown');
            if (parent) {
                parent.classList.remove('is-open');
            }
        });
    });

    const navBurgers = document.querySelectorAll('.nav-burger');
    navBurgers.forEach(burger => {
        const container = burger.closest('nav, header');
        if (!container) {
            return;
        }
        const mobile = container.querySelector('.nav-mobile');
        const overlay = container.querySelector('.nav-mobile__overlay');
        const closeButton = container.querySelector('.nav-mobile__close');

        if (!mobile) {
            return;
        }

        const closeMenu = () => {
            burger.setAttribute('aria-expanded', 'false');
            mobile.hidden = true;
        };

        burger.addEventListener('click', () => {
            const isOpen = burger.getAttribute('aria-expanded') === 'true';
            burger.setAttribute('aria-expanded', String(!isOpen));
            mobile.hidden = isOpen;
        });

        if (overlay) {
            overlay.addEventListener('click', closeMenu);
        }

        if (closeButton) {
            closeButton.addEventListener('click', closeMenu);
        }

        mobile.addEventListener('click', (event) => {
            const target = event.target;
            if (target instanceof Element && target.tagName === 'A') {
                closeMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 1173) {
                closeMenu();
            }
        });
    });

    const mobileGroups = document.querySelectorAll('.nav-mobile__group');
    mobileGroups.forEach(group => {
        const title = group.querySelector('.nav-mobile__title');
        if (!title) {
            return;
        }
        title.setAttribute('role', 'button');
        title.setAttribute('tabindex', '0');
        title.setAttribute('aria-expanded', 'false');

        const toggleGroup = () => {
            const isOpen = group.classList.contains('is-open');
            group.classList.toggle('is-open', !isOpen);
            title.setAttribute('aria-expanded', String(!isOpen));
        };

        title.addEventListener('click', toggleGroup);
        title.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleGroup();
            }
        });
    });

    const projectsPage = document.querySelector('.projects-page');
    if (projectsPage) {
        const searchInput = document.getElementById('projects-search');
        const filterButtons = Array.from(document.querySelectorAll('.projects-chip[data-filter]'));
        const cards = Array.from(document.querySelectorAll('.projects-card'));
        let activeFilter = 'all';

        const normalize = (value) => (value || '').toLowerCase().trim();
        const getCardCategory = (card) => {
            if (card.dataset.category) {
                return normalize(card.dataset.category);
            }
            const badge = card.querySelector('.projects-card__badge');
            const badgeText = badge ? normalize(badge.textContent) : '';
            const categoryMap = {
                'коммерческие': 'commercial',
                'жилые': 'residential',
                'медицина': 'healthcare',
                'образование': 'educational',
                'промышленность': 'industrial',
                'общественные': 'public'
            };
            return categoryMap[badgeText] || badgeText;
        };
        const getCardText = (card) => {
            const title = card.dataset.title || card.querySelector('h3')?.textContent;
            const location = card.dataset.location || card.querySelector('.projects-card__location')?.textContent;
            const tags = card.dataset.tags || Array.from(card.querySelectorAll('.projects-card__tags span')).map(t => t.textContent).join(' ');
            const year = card.dataset.year || card.querySelector('.projects-card__stats span')?.textContent;
            return normalize([title, location, tags, year].join(' '));
        };

        const applyFilters = () => {
            const query = normalize(searchInput ? searchInput.value : '');
            cards.forEach(card => {
                const matchesCategory = activeFilter === 'all' || getCardCategory(card) === activeFilter;
                const matchesQuery = !query || getCardText(card).includes(query);
                const visible = matchesCategory && matchesQuery;
                card.classList.toggle('projects-card--hidden', !visible);
                card.style.display = visible ? '' : 'none';
            });
        };

        const activeButton = filterButtons.find(button => button.classList.contains('projects-chip--active'));
        if (activeButton) {
            activeFilter = normalize(activeButton.dataset.filter);
        }

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                activeFilter = normalize(button.dataset.filter);
                filterButtons.forEach(item => item.classList.remove('projects-chip--active'));
                button.classList.add('projects-chip--active');
                applyFilters();
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', applyFilters);
            searchInput.addEventListener('change', applyFilters);
        }

        applyFilters();
    }

    const blogPage = document.querySelector('.blog-page');
    if (blogPage) {
        const filterBar = blogPage.querySelector('[data-blog-filters]');
        const filterButtons = Array.from(blogPage.querySelectorAll('[data-filter], .blog-filters__button'));
        const cards = Array.from(blogPage.querySelectorAll('[data-category]'));

        if (filterBar && cards.length) {
            const normalize = (value) => (value || '').toLowerCase().trim();
            let activeFilter = 'all';
            const activeButton = filterButtons.find(button => button.classList.contains('blog-filters__button--active'));
            if (activeButton) {
                activeFilter = normalize(activeButton.dataset.filter || activeButton.textContent);
            }

            const applyBlogFilters = () => {
                cards.forEach(card => {
                    const raw = card.dataset.category || '';
                    const categories = raw.split(',').map(item => normalize(item));
                    const matches = activeFilter === 'all' || categories.includes(activeFilter);
                    card.style.display = matches ? '' : 'none';
                });
            };

            filterBar.addEventListener('click', (event) => {
                const button = event.target.closest('[data-filter], .blog-filters__button');
                if (!button) return;
                activeFilter = normalize(button.dataset.filter || button.textContent);
                filterButtons.forEach(btn => btn.classList.toggle('blog-filters__button--active', btn === button));
                applyBlogFilters();
            });

            applyBlogFilters();
        }
    }

    const charityPage = document.querySelector('.charity-page');
    if (charityPage) {
        const buttons = Array.from(charityPage.querySelectorAll('.charity-filters__button'));
        const cards = Array.from(charityPage.querySelectorAll('.charity-card'));
        if (buttons.length && cards.length) {
            const normalize = (value) => (value || '').toLowerCase().trim();
            let activeFilter = 'all';
            const activeButton = buttons.find(button => button.classList.contains('charity-filters__button--active'));
            if (activeButton) {
                activeFilter = normalize(activeButton.dataset.filter || activeButton.textContent);
            }

            const applyCharityFilters = () => {
                cards.forEach(card => {
                    const tag = card.querySelector('.charity-card__tag');
                    const category = normalize(tag ? tag.textContent : '');
                    const matches = activeFilter === 'all' || category === activeFilter;
                    card.style.display = matches ? '' : 'none';
                });
            };

            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    activeFilter = normalize(button.dataset.filter || button.textContent);
                    buttons.forEach(btn => btn.classList.remove('charity-filters__button--active'));
                    button.classList.add('charity-filters__button--active');
                    applyCharityFilters();
                });
            });

            applyCharityFilters();
        }
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) {
        document.querySelectorAll('.has-dropdown.is-open').forEach(item => {
            item.classList.remove('is-open');
        });
    }
});


// ============ about.html ============

// Initialize AOS (Animate On Scroll)
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
}

// Simple Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (nav && window.scrollY > 50) {
        nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
    } else if (nav) {
        nav.style.boxShadow = 'none';
    }
});


// ============ lumex.html ============

// Initialize AOS for lumex page
if (typeof AOS !== 'undefined') {
    AOS.init({ 
        duration: 800, 
        once: true 
    });
}


// ============ supply.html ============

// Simple scroll effect for navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar && window.scrollY > 50) {
        navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
    } else if (navbar) {
        navbar.style.boxShadow = 'none';
    }
});


// ============ SCROLL REVEAL ANIMATION ============

// Scroll Reveal Animation
const observerOptions = { threshold: 0.1 };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal, .reveal-up').forEach(el => observer.observe(el));

// Simple Button Micro-interaction
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mousedown', () => button.style.transform = 'scale(0.95)');
    button.addEventListener('mouseup', () => button.style.transform = 'scale(1)');
});

/* ===================================
   End of Combined JavaScript
   =================================== */

// ============ project*.html (gallery lightbox) ============
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('galleryModal');
    if (!modal) {
        return;
    }

    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.gallery-modal__close');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item-clickable'));

    if (!modalImage || !modalCaption || !closeBtn || !prevBtn || !nextBtn || !galleryItems.length) {
        return;
    }

    let currentImageIndex = 0;

    const updateModalImage = () => {
        const img = galleryItems[currentImageIndex]?.querySelector('img');
        if (!img) {
            return;
        }
        modalImage.src = img.src;
        modalCaption.textContent = img.alt || '';
    };

    const closeModal = () => {
        modal.classList.remove('active');
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            modal.classList.add('active');
            currentImageIndex = index;
            updateModalImage();
        });
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!modal.classList.contains('active')) {
            return;
        }

        if (event.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
            updateModalImage();
        } else if (event.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
            updateModalImage();
        } else if (event.key === 'Escape') {
            closeModal();
        }
    });

    prevBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        updateModalImage();
    });

    nextBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        updateModalImage();
    });
});

// ============ charity detail donation modals ============
document.addEventListener('DOMContentLoaded', () => {
    const donationModal = document.getElementById('donationModal');
    const successModal = document.getElementById('donationSuccessModal');
    const openBtn = document.querySelector('[data-donate-open]');
    const donationForm = document.getElementById('donationForm');

    if (!donationModal || !successModal || !openBtn || !donationForm) {
        return;
    }

    const donationCloseControls = Array.from(donationModal.querySelectorAll('[data-donate-close]'));
    const successCloseControls = Array.from(successModal.querySelectorAll('[data-success-close]'));

    const openDonationModal = () => {
        donationModal.classList.add('is-open');
        donationModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('overflow-hidden');
    };

    const closeDonationModal = () => {
        donationModal.classList.remove('is-open');
        donationModal.setAttribute('aria-hidden', 'true');
    };

    const openSuccessModal = () => {
        successModal.classList.add('is-open');
        successModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('overflow-hidden');
    };

    const closeSuccessModal = () => {
        successModal.classList.remove('is-open');
        successModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('overflow-hidden');
    };

    openBtn.addEventListener('click', openDonationModal);

    donationCloseControls.forEach((el) => {
        el.addEventListener('click', closeDonationModal);
    });

    successCloseControls.forEach((el) => {
        el.addEventListener('click', closeSuccessModal);
    });

    donationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        closeDonationModal();
        openSuccessModal();
        donationForm.reset();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        if (donationModal.classList.contains('is-open')) {
            closeDonationModal();
            document.body.classList.remove('overflow-hidden');
        }
        if (successModal.classList.contains('is-open')) {
            closeSuccessModal();
        }
    });
});

// ============ certificate image modal ============
document.addEventListener('DOMContentLoaded', () => {
    const certImages = Array.from(document.querySelectorAll('.diodus-cert__image, .about-partners__cert-img'));
    if (!certImages.length) {
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'cert-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="cert-modal__backdrop" data-cert-close></div>
        <div class="cert-modal__dialog" role="dialog" aria-modal="true" aria-label="Просмотр сертификата">
            <button class="cert-modal__close" type="button" aria-label="Закрыть" data-cert-close>×</button>
            <img class="cert-modal__image" alt="Сертификат">
        </div>
    `;

    document.body.appendChild(modal);

    const modalImage = modal.querySelector('.cert-modal__image');
    const closeControls = Array.from(modal.querySelectorAll('[data-cert-close]'));

    const openModal = (src, alt) => {
        if (!modalImage) return;
        modalImage.src = src;
        modalImage.alt = alt || 'Сертификат';
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('overflow-hidden');
    };

    const closeModal = () => {
        if (!modalImage) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        modalImage.src = '';
        document.body.classList.remove('overflow-hidden');
    };

    certImages.forEach((img) => {
        img.setAttribute('role', 'button');
        img.setAttribute('tabindex', '0');
        img.addEventListener('click', () => openModal(img.src, img.alt));
        img.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openModal(img.src, img.alt);
            }
        });
    });

    closeControls.forEach((control) => {
        control.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
});
