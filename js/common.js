$(document).ready(function () {
	// Fancybox init
	if (document.querySelector('[data-fancybox]')) {
		Fancybox.bind('[data-fancybox]', {
			dragToClose: false,
			closeButton: false,
		});
	}

	// Reviews carousel swiper
	const reviews__carousel = document.querySelector('.reviews__carousel');
	if (reviews__carousel) {
		const swiper = new Swiper(reviews__carousel, {
			slidesPerView: 'auto',
			allowTouchMove: true,
			spaceBetween: 20,
			loop: true,
			speed: 700,
			//autoplay: true,
			pagination: {
				el: '.reviews--pagi',
				clickable: true,
			},
			navigation: {
				nextEl: '.reviews--navi-next',
				prevEl: '.reviews--navi-prev',
			},
		});
	}

});

// Add .header--scroll to Header
function updateHeaderScrollClass() {
	const header = document.querySelector('.header');
	if (!header) return;
	
	if (window.scrollY > 0) {
		header.classList.add('header--scroll');
	} else {
		header.classList.remove('header--scroll');
	}
}
document.addEventListener('scroll', updateHeaderScrollClass);
document.addEventListener('DOMContentLoaded', updateHeaderScrollClass);

// Scroll links
document.addEventListener('DOMContentLoaded', function () {
	const OFFSET_DESKTOP = 90;
	const OFFSET_MOBILE = 80;
	const MOBILE_BREAKPOINT = 1079.98;

	const header = document.querySelector('.header');
	const burgerBtn = document.querySelector('.header__mobile-burger');
	const mobileMenu = document.querySelector('.header__mobile-menu');

	if (burgerBtn && mobileMenu && header) {
		burgerBtn.addEventListener('click', function () {
			burgerBtn.classList.toggle('active');
			mobileMenu.classList.toggle('active');
			header.classList.toggle('open-menu');
		});
	}

	function getHeaderOffset() {
		return window.innerWidth <= MOBILE_BREAKPOINT ? OFFSET_MOBILE : OFFSET_DESKTOP;
	}

	function scrollToTarget(id) {
		const target = document.getElementById(id);
		if (target) {
			const offset = getHeaderOffset();
			const top = target.getBoundingClientRect().top + window.scrollY - offset;
			window.scrollTo({
				top: top,
				behavior: 'smooth'
			});
		}
	}

	function handleLinkClick(e) {
		const href = this.getAttribute('href');
		if (href.startsWith('#') && href.length > 1) {
			e.preventDefault();
			const id = href.substring(1);
			scrollToTarget(id);

			if (window.innerWidth <= MOBILE_BREAKPOINT) {
				burgerBtn.classList.remove('active');
				mobileMenu.classList.remove('active');
				header.classList.remove('open-menu');
			}
		}
	}

	const links = document.querySelectorAll('a[href^="#"]:not([href="#"]), .scroll-btn');
	links.forEach(link => {
		link.addEventListener('click', handleLinkClick);
	});
});

// Scroll to Top
document.addEventListener("DOMContentLoaded", function() {
	const scrollTopBtn = document.getElementById("scr_top");
	const scrollOffset = 800;

	if (!scrollTopBtn) return;

	window.addEventListener("scroll", () => {
		scrollTopBtn.classList.toggle("visible", window.scrollY > scrollOffset);
	});

	scrollTopBtn.addEventListener("click", () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	});
});

// Default carousel swiper
document.addEventListener('DOMContentLoaded', function () {
	const breakpoint = 991.98;
	const carousels = document.querySelectorAll('.def-carousel');

	if (!carousels.length) return;

	carousels.forEach((carousel) => {
		let swiperInstance = null;
		const initOrDestroy = () => {
			if (window.innerWidth <= breakpoint) {
				if (!swiperInstance) {
					swiperInstance = new Swiper(carousel, {
						slidesPerView: 'auto',
						spaceBetween: 20,
						allowTouchMove: true,
						loop: false,
						speed: 700,
						pagination: {
							el: '.def--pagi',
							clickable: true,
						},
					});
				}
			} else {
				if (swiperInstance) {
					swiperInstance.destroy(true, true);
					swiperInstance = null;
				}
			}
		};
		initOrDestroy();
		window.addEventListener('resize', initOrDestroy);
	});
});

// Toggles
document.addEventListener('DOMContentLoaded', function () {
	const toggleBlocks = document.querySelectorAll('.block__toggle');
	if (toggleBlocks.length === 0) {
		return;
	}
	toggleBlocks.forEach(block => {
		const header = block.querySelector('.toggle__header');
		const button = block.querySelector('.toggle__header-btn');
		const content = block.querySelector('.toggle__content');
		if (!header || !button || !content) {
			return;
		}

		button.setAttribute('aria-expanded', 'false');

		header.addEventListener('click', function () {
			if (content.style.maxHeight) {
				content.style.maxHeight = null;
				content.style.paddingBottom = null;
				button.classList.remove('v_active');
				content.classList.remove('c_active');
				block.classList.remove('t_active');
				button.setAttribute('aria-expanded', 'false');
			} else {
				content.style.maxHeight = content.scrollHeight + 20 + 'px';
				content.style.paddingBottom = '20px';
				button.classList.add('v_active');
				content.classList.add('c_active');
				block.classList.add('t_active');
				button.setAttribute('aria-expanded', 'true');
			}
		});
	});
});

// SEO text toggle
document.addEventListener('DOMContentLoaded', function () {
	const seoSection = document.querySelector('.seotxt__content');
	if (!seoSection) {
		return;
	}

	const contentWrap = seoSection.querySelector('.seotxt__text');
	const shadowBl = seoSection.querySelector('.seotxt__buttons');
	const button = seoSection.querySelector('.seotxt__btn');

	if (!contentWrap || !shadowBl || !button) {
		return;
	}

	const minHeight = 280;

	contentWrap.style.maxHeight = minHeight + 'px';

	button.addEventListener('click', function () {
		if (contentWrap.style.maxHeight && parseInt(contentWrap.style.maxHeight) > minHeight) {
			contentWrap.style.maxHeight = minHeight + 'px';
			shadowBl.classList.remove('shadow--none');
			button.classList.remove('btn--active');
		} else {
			contentWrap.style.maxHeight = contentWrap.scrollHeight + 'px';
			shadowBl.classList.add('shadow--none');
			button.classList.add('btn--active');
		}
	});
});

// File upload custom UI (max 3 images)
document.addEventListener('DOMContentLoaded', function () {
	const upload = document.querySelector('.file-upload');
	if (!upload) return;

	const input = upload.querySelector('#file_input');
	const list = upload.querySelector('#file_list');
	if (!input || !list) return;

	const MAX_FILES = 3;
	let files = [];

	input.addEventListener('change', function (e) {
		addFiles(Array.from(e.target.files || []));
		input.value = '';
	});

	function addFiles(newFiles) {
		for (const file of newFiles) {
			if (!file.type.startsWith('image/')) continue;
			if (files.length >= MAX_FILES) break;
			const exists = files.some(f => f.name === file.name && f.size === file.size);
			if (!exists) files.push(file);
		}
		render();
	}

	function render() {
		list.innerHTML = '';
		files.forEach(function (file, index) {
			const item = document.createElement('div');
			item.className = 'file-item';
			item.innerHTML =
				'<span class="file-item__name">' + file.name + '</span>' +
				'<button type="button" class="file-remove" data-index="' + index + '" aria-label="Remove file">×</button>';
			list.appendChild(item);
		});
	}

	list.addEventListener('click', function (e) {
		const btn = e.target.closest('.file-remove');
		if (!btn) return;
		const index = parseInt(btn.getAttribute('data-index'), 10);
		if (isNaN(index)) return;
		files.splice(index, 1);
		render();
	});
});