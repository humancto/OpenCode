// Enhanced Language Selector with Categories and Icons
(function() {
  const languageData = {
    web: {
      label: "Web Development",
      icon: "🌐",
      languages: [
        { value: "javascript", label: "JavaScript", icon: "JS", color: "#F7DF1E", popular: true },
        { value: "typescript", label: "TypeScript", icon: "TS", color: "#3178C6", popular: true },
        { value: "html", label: "HTML", icon: "⚡", color: "#E34C26" },
        { value: "css", label: "CSS", icon: "🎨", color: "#1572B6" },
        { value: "php", label: "PHP", icon: "🐘", color: "#777BB4" },
        { value: "ruby", label: "Ruby", icon: "💎", color: "#CC342D" }
      ]
    },
    systems: {
      label: "Systems Programming",
      icon: "⚙️",
      languages: [
        { value: "c_cpp", label: "C/C++", icon: "C", color: "#00599C", popular: true },
        { value: "rust", label: "Rust", icon: "🦀", color: "#000000", popular: true },
        { value: "go", label: "Go", icon: "🐹", color: "#00ADD8", popular: true },
        { value: "csharp", label: "C#", icon: "C#", color: "#239120" },
        { value: "java", label: "Java", icon: "☕", color: "#007396", popular: true }
      ]
    },
    mobile: {
      label: "Mobile Development",
      icon: "📱",
      languages: [
        { value: "swift", label: "Swift", icon: "🦉", color: "#FA7343" },
        { value: "kotlin", label: "Kotlin", icon: "K", color: "#7F52FF" }
      ]
    },
    data: {
      label: "Data & Scripting",
      icon: "📊",
      languages: [
        { value: "python", label: "Python", icon: "🐍", color: "#3776AB", popular: true },
        { value: "sql", label: "SQL", icon: "🗃️", color: "#336791" },
        { value: "markdown", label: "Markdown", icon: "📝", color: "#000000" }
      ]
    }
  };

  class EnhancedLanguageSelector {
    constructor() {
      this.currentLanguage = 'javascript';
      this.selectorElement = null;
      this.dropdownElement = null;
      this.searchInput = null;
      this.isOpen = false;
      this.filteredLanguages = this.getAllLanguages();
    }

    getAllLanguages() {
      const allLangs = [];
      Object.values(languageData).forEach(category => {
        category.languages.forEach(lang => {
          allLangs.push({ ...lang, category: category.label });
        });
      });
      return allLangs;
    }

    init() {
      const existingSelector = document.getElementById('language-selector');
      if (!existingSelector) return;

      // Replace the existing select with our enhanced component
      this.createEnhancedSelector(existingSelector);
      this.attachEventListeners();
      this.loadSavedLanguage();
    }

    createEnhancedSelector(originalSelect) {
      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'enhanced-language-selector';
      wrapper.innerHTML = `
        <div class="language-selector-button" role="button" tabindex="0">
          <div class="selected-language">
            <span class="lang-icon">JS</span>
            <span class="lang-label">JavaScript</span>
            <span class="popular-badge">POPULAR</span>
          </div>
          <svg class="dropdown-arrow" width="12" height="8" viewBox="0 0 12 8">
            <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="language-dropdown" style="display: none;">
          <div class="language-search">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16">
              <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" fill="none" stroke-width="2"/>
              <path d="M11 11L14 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input type="text" placeholder="Search languages..." class="language-search-input">
          </div>
          <div class="language-categories"></div>
          <div class="language-footer">
            <div class="quick-actions">
              <button class="quick-action-btn" data-action="recent">
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" fill="none" stroke-width="1.5"/>
                  <path d="M7 3V7L9.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Recent
              </button>
              <button class="quick-action-btn" data-action="popular">
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <path d="M7 1L9 5L13 5.5L10 8.5L10.5 13L7 11L3.5 13L4 8.5L1 5.5L5 5L7 1Z" 
                        fill="currentColor" stroke="none"/>
                </svg>
                Popular
              </button>
            </div>
          </div>
        </div>
      `;

      // Insert the wrapper before the original select
      originalSelect.parentNode.insertBefore(wrapper, originalSelect);
      originalSelect.style.display = 'none';

      // Store references
      this.selectorElement = wrapper.querySelector('.language-selector-button');
      this.dropdownElement = wrapper.querySelector('.language-dropdown');
      this.searchInput = wrapper.querySelector('.language-search-input');

      // Render categories
      this.renderCategories();
    }

    renderCategories(filter = '') {
      const categoriesContainer = this.dropdownElement.querySelector('.language-categories');
      categoriesContainer.innerHTML = '';

      Object.entries(languageData).forEach(([key, category]) => {
        const filteredLangs = category.languages.filter(lang =>
          lang.label.toLowerCase().includes(filter.toLowerCase())
        );

        if (filteredLangs.length === 0) return;

        const categoryEl = document.createElement('div');
        categoryEl.className = 'language-category';
        categoryEl.innerHTML = `
          <div class="category-header">
            <span class="category-icon">${category.icon}</span>
            <span class="category-label">${category.label}</span>
          </div>
          <div class="category-languages">
            ${filteredLangs.map(lang => `
              <button class="language-option ${lang.value === this.currentLanguage ? 'selected' : ''}" 
                      data-value="${lang.value}"
                      data-label="${lang.label}"
                      data-icon="${lang.icon}"
                      data-color="${lang.color}"
                      data-popular="${lang.popular || false}">
                <span class="lang-option-icon" style="background: ${lang.color}">${lang.icon}</span>
                <span class="lang-option-label">${lang.label}</span>
                ${lang.popular ? '<span class="mini-badge">★</span>' : ''}
              </button>
            `).join('')}
          </div>
        `;
        categoriesContainer.appendChild(categoryEl);
      });
    }

    attachEventListeners() {
      // Toggle dropdown
      this.selectorElement.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdown();
      });

      // Keyboard navigation
      this.selectorElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleDropdown();
        }
      });

      // Search functionality
      this.searchInput.addEventListener('input', (e) => {
        this.renderCategories(e.target.value);
      });

      // Language selection
      this.dropdownElement.addEventListener('click', (e) => {
        const option = e.target.closest('.language-option');
        if (option) {
          this.selectLanguage(option.dataset);
        }

        const quickAction = e.target.closest('.quick-action-btn');
        if (quickAction) {
          this.handleQuickAction(quickAction.dataset.action);
        }
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.enhanced-language-selector')) {
          this.closeDropdown();
        }
      });

      // Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.closeDropdown();
        }
      });
    }

    toggleDropdown() {
      this.isOpen ? this.closeDropdown() : this.openDropdown();
    }

    openDropdown() {
      this.dropdownElement.style.display = 'block';
      this.selectorElement.classList.add('active');
      this.isOpen = true;
      
      // Animate in
      requestAnimationFrame(() => {
        this.dropdownElement.classList.add('show');
        this.searchInput.focus();
      });
    }

    closeDropdown() {
      this.dropdownElement.classList.remove('show');
      this.selectorElement.classList.remove('active');
      
      setTimeout(() => {
        this.dropdownElement.style.display = 'none';
        this.searchInput.value = '';
        this.renderCategories();
      }, 200);
      
      this.isOpen = false;
    }

    selectLanguage(langData) {
      this.currentLanguage = langData.value;
      
      // Update button display
      const selectedDisplay = this.selectorElement.querySelector('.selected-language');
      selectedDisplay.innerHTML = `
        <span class="lang-icon" style="background: ${langData.color}">${langData.icon}</span>
        <span class="lang-label">${langData.label}</span>
        ${langData.popular === 'true' ? '<span class="popular-badge">POPULAR</span>' : ''}
      `;

      // Update original select (for compatibility)
      const originalSelect = document.getElementById('language-selector');
      if (originalSelect) {
        originalSelect.value = langData.value;
        originalSelect.dispatchEvent(new Event('change'));
      }

      // Save preference
      localStorage.setItem('preferred-language', langData.value);

      // Add to recent languages
      this.addToRecent(langData);

      // Close dropdown with animation
      this.closeDropdown();

      // Trigger celebration for first selection
      if (!localStorage.getItem('has-selected-language')) {
        localStorage.setItem('has-selected-language', 'true');
        this.triggerCelebration();
      }
    }

    handleQuickAction(action) {
      if (action === 'popular') {
        this.showPopularLanguages();
      } else if (action === 'recent') {
        this.showRecentLanguages();
      }
    }

    showPopularLanguages() {
      const popularLangs = this.getAllLanguages().filter(lang => lang.popular);
      this.renderFilteredLanguages(popularLangs, 'Popular Languages');
    }

    showRecentLanguages() {
      const recent = JSON.parse(localStorage.getItem('recent-languages') || '[]');
      const recentLangs = recent.map(value => 
        this.getAllLanguages().find(lang => lang.value === value)
      ).filter(Boolean);
      this.renderFilteredLanguages(recentLangs, 'Recent Languages');
    }

    renderFilteredLanguages(languages, title) {
      const categoriesContainer = this.dropdownElement.querySelector('.language-categories');
      categoriesContainer.innerHTML = `
        <div class="filtered-section">
          <h3 class="filtered-title">${title}</h3>
          <div class="filtered-languages">
            ${languages.map(lang => `
              <button class="language-option ${lang.value === this.currentLanguage ? 'selected' : ''}" 
                      data-value="${lang.value}"
                      data-label="${lang.label}"
                      data-icon="${lang.icon}"
                      data-color="${lang.color}"
                      data-popular="${lang.popular || false}">
                <span class="lang-option-icon" style="background: ${lang.color}">${lang.icon}</span>
                <span class="lang-option-label">${lang.label}</span>
                ${lang.popular ? '<span class="mini-badge">★</span>' : ''}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    addToRecent(langData) {
      const recent = JSON.parse(localStorage.getItem('recent-languages') || '[]');
      const filtered = recent.filter(v => v !== langData.value);
      filtered.unshift(langData.value);
      localStorage.setItem('recent-languages', JSON.stringify(filtered.slice(0, 5)));
    }

    loadSavedLanguage() {
      const saved = localStorage.getItem('preferred-language');
      if (saved) {
        const lang = this.getAllLanguages().find(l => l.value === saved);
        if (lang) {
          this.selectLanguage({
            value: lang.value,
            label: lang.label,
            icon: lang.icon,
            color: lang.color,
            popular: lang.popular ? 'true' : 'false'
          });
        }
      }
    }

    triggerCelebration() {
      // Create celebration particles
      const celebration = document.createElement('div');
      celebration.className = 'language-celebration';
      celebration.innerHTML = `
        <div class="celebration-text">Great Choice! 🎉</div>
        <div class="particles"></div>
      `;
      document.body.appendChild(celebration);

      // Create particles
      const particlesContainer = celebration.querySelector('.particles');
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('span');
        particle.className = 'particle';
        particle.style.setProperty('--angle', Math.random() * 360 + 'deg');
        particle.style.setProperty('--distance', Math.random() * 100 + 50 + 'px');
        particle.style.animationDelay = Math.random() * 0.3 + 's';
        particlesContainer.appendChild(particle);
      }

      // Remove after animation
      setTimeout(() => {
        celebration.remove();
      }, 2000);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new EnhancedLanguageSelector().init();
    });
  } else {
    new EnhancedLanguageSelector().init();
  }
})();