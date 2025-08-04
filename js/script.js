
      // --- ELEMENT SELECTORS ---
      const playBtn = document.getElementById("playBtn");
      const pauseBtn = document.getElementById("pauseBtn");
      const skipBtn = document.querySelector(".skip-button");
      const infoBtn = document.getElementById("infoBtn");
      const doomerSwitch = document.getElementById("doomerToggle");
      const slider = document.querySelector(".slider");
      const screenContainer = document.querySelector(".screen");
      const audioPlayer = document.getElementById("audioPlayer");
      const waves = document.querySelectorAll(".waves");

      // --- MODAL ELEMENT SELECTORS ---
      const infoModalOverlay = document.getElementById("infoModalOverlay");
      const closeInfoModal = document.getElementById("closeInfoModal");
      const modalTitle = document.getElementById("modalTitle");
      const modalTrack = document.getElementById("modalTrack");
      const modalArtist = document.getElementById("modalArtist");
      const modalMood = document.getElementById("modalMood");

      // --- DATA AND STATE VARIABLES ---
      const audioFiles = {
        low: [{ file: 'music/low/music1.mp3', artist: 'Ed Sheeran' }, { file: 'music/low/music2.mp3', artist: 'Shuja Haider' }],
        medium: [{ file: 'music/medium/music3.mp3', artist: 'Ed Sheeran' }, { file: 'music/medium/music4.mp3', artist: 'Ali Hamza, Ali Azmat, Ali Noor, Asim Azhar' }],
        high: [{ file: 'music/high/music5.mp3', artist: 'Sahir Ali Bagga, Damia Farooq, Parisa Farooq' }, { file: 'music/high/music6.mp3', artist: 'Ed Sheeran' }]
      };
      const audioFilesDoomer = {
        low: [{ file: 'music_doomer/low/music1.mp3', artist: 'Ed Sheeran' }, { file: 'music_doomer/low/music2.mp3', artist: 'Shuja Haider' }],
        medium: [{ file: 'music_doomer/medium/music3.mp3', artist: 'Ed Sheeran' }, { file: 'music_doomer/medium/music4.mp3', artist: 'Ali Hamza, Ali Azmat, Ali Noor, Asim Azhar' }],
        high: [{ file: 'music_doomer/high/music5.mp3', artist: 'Sahir Ali Bagga, Damia Farooq, Parisa Farooq' }, { file: 'music_doomer/high/music6.mp3', artist: 'Ed Sheeran' }]
      };
      const videoClips = {
        low: 'videos/low_clip.mp4',
        medium: 'videos/medium_clip.mp4',
        high: 'videos/high_clip.mp4'
      };

      let currentLevel = 'medium';
      let currentIndex = -1;
      let isPlaying = false;
      const lastPlayedIndexByLevel = { low: -1, medium: -1, high: -1 };

      // --- HELPER FUNCTIONS ---
      function getCurrentTrackList(level) {
        return doomerSwitch.checked ? audioFilesDoomer[level] : audioFiles[level];
      }

      function getLevelFromSlider() {
        const value = parseInt(slider.value, 10);
        if (value <= 33) return 'low';
        if (value <= 66) return 'medium';
        return 'high';
      }

      function playTrackAtIndex(level, index) {
        const tracks = getCurrentTrackList(level);
        if (index >= tracks.length) index = 0;

        currentLevel = level;
        currentIndex = index;
        lastPlayedIndexByLevel[level] = index;

        const trackObj = tracks[index];
        audioPlayer.src = trackObj.file;
        audioPlayer.play();
        isPlaying = true;

        screenContainer.innerHTML = `
          <video id="backgroundVideo" width="100%" muted loop autoplay>
            <source src="${videoClips[level]}" type="video/mp4">
          </video>`;
        
        setActiveButton('play');
        waves.forEach(w => w.style.display = 'none');
      }
      
      function setActiveButton(activeButton) {
        if (activeButton === "play") {
          playBtn.classList.add("active-btn");
          pauseBtn.classList.remove("active-btn");
        } else if (activeButton === "pause") {
          pauseBtn.classList.add("active-btn");
          playBtn.classList.remove("active-btn");
        }
      }

      // --- EVENT LISTENERS ---
      slider.addEventListener('input', () => {
        const newLevel = getLevelFromSlider();
        if (newLevel !== currentLevel) {
            currentLevel = newLevel;
            if(isPlaying){
                const tracks = getCurrentTrackList(currentLevel);
                let indexToPlay = lastPlayedIndexByLevel[currentLevel];
                if (indexToPlay === -1 || indexToPlay >= tracks.length) {
                    indexToPlay = Math.floor(Math.random() * tracks.length);
                }
                playTrackAtIndex(currentLevel, indexToPlay);
            }
        }
      });
      
      playBtn.addEventListener('click', () => {
        const tracks = getCurrentTrackList(currentLevel);
        if (currentIndex === -1 || !audioPlayer.src.includes(tracks[0].file.split('/')[1])) {
            const index = currentIndex === -1 ? Math.floor(Math.random() * tracks.length) : currentIndex;
            playTrackAtIndex(currentLevel, index);
        } else {
            audioPlayer.play();
            const videoElement = document.getElementById('backgroundVideo');
            if (videoElement) videoElement.play();
            isPlaying = true;
            setActiveButton('play');
        }
      });

      pauseBtn.addEventListener('click', () => {
        audioPlayer.pause();
        const videoElement = document.getElementById('backgroundVideo');
        if (videoElement) videoElement.pause();
        isPlaying = false;
        setActiveButton('pause');
      });

      skipBtn.addEventListener('click', () => {
        const tracks = getCurrentTrackList(currentLevel);
        let nextIndex = 0;
        if(currentIndex !== -1){
            nextIndex = currentIndex + 1;
            if(nextIndex >= tracks.length) nextIndex = 0;
        } else {
            nextIndex = Math.floor(Math.random() * tracks.length);
        }
        playTrackAtIndex(currentLevel, nextIndex);
      });

      audioPlayer.addEventListener('ended', () => {
        const tracks = getCurrentTrackList(currentLevel);
        let nextIndex = currentIndex + 1;
        if (nextIndex >= tracks.length) nextIndex = 0;
        playTrackAtIndex(currentLevel, nextIndex);
      });

      doomerSwitch.addEventListener('change', () => {
        document.body.classList.toggle('doomer-theme', doomerSwitch.checked);
        if (currentIndex !== -1 && isPlaying) {
            playTrackAtIndex(currentLevel, currentIndex);
        } else if (currentIndex !== -1) {
            const tracks = getCurrentTrackList(currentLevel);
            audioPlayer.src = tracks[currentIndex].file;
        }
      });

      // --- MODAL LOGIC ---
      infoBtn.addEventListener('click', () => {
        const tracks = getCurrentTrackList(currentLevel);
        if (currentIndex === -1 || currentIndex >= tracks.length) {
            modalTitle.textContent = "No Data";
            modalTrack.textContent = "Track: --";
            modalArtist.textContent = "Artist: --";
            modalMood.textContent = "Mood: " + currentLevel.toUpperCase();
        } else {
            const currentTrack = tracks[currentIndex];
            modalTitle.textContent = "Track Information";
            modalTrack.textContent = `Track: ${currentTrack.file.split('/').pop()}`;
            modalArtist.textContent = `Artist: ${currentTrack.artist}`;
            modalMood.textContent = `Mood: ${currentLevel.toUpperCase()}`;
        }
        infoModalOverlay.classList.add('show');
      });

      function closeModal() {
        infoModalOverlay.classList.remove('show');
      }

      closeInfoModal.addEventListener('click', closeModal);
      infoModalOverlay.addEventListener('click', (event) => {
        if (event.target === infoModalOverlay) closeModal();
      });
