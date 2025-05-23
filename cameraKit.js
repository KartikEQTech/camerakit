class CameraKit {
  constructor() {
    this.cameraKit = null;
    this.session = null;
    this.initialized = false;
    this.apiToken = "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQ3NjQwOTIxLCJzdWIiOiI1YTc1ZTdkMS1mNGIxLTQyNzktYTE5Zi1mNTRlNmUyZThlZTF-U1RBR0lOR34wZDI1OTBhMS03ZTQ1LTQ3YzQtOGNiNy04YjM0OWQ0MzYwMTUifQ.xjb7h3PJeTCtyLheoFn0wywk5K36ninT18aoigb6yXE";
  }

  async initialize() {
    if (this.initialized) return;

    try {
      this.cameraKit = await window.CAMERA_KIT.createCameraKit({
        apiToken: this.apiToken
      });

      const canvas = document.getElementById('video-canvas');
      this.session = await this.cameraKit.createSession({ 
        liveRenderTarget: canvas 
      });

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          frameRate: { ideal: 30, max: 60 }
        },
        audio: false
      });

      const source = await window.CAMERA_KIT.createMediaStreamSource(mediaStream, {
        cameraType: 'front',
        transform: window.CAMERA_KIT.Transform2D.MirrorX
      });

      await this.session.setSource(source);
      await source.setRenderSize(window.innerWidth, window.innerHeight);
      await this.session.play();

      this.initialized = true;
      console.log('Camera Kit initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Camera Kit:', error);
      throw error;
    }
  }

  async applyLens(lensId, groupId) {
    try {
      if (!this.initialized) {
        throw new Error('Camera Kit not initialized');
      }

      const lens = await this.cameraKit.lensRepository.loadLens(
        lensId,
        groupId
      );
      await this.session.applyLens(lens);
      console.log('Lens applied successfully');
    } catch (error) {
      console.error('Failed to apply lens:', error);
      throw error;
    }
  }

  async removeLens() {
    try {
      if (!this.initialized) return;
      await this.session.removeLens();
      console.log('Lens removed successfully');
    } catch (error) {
      console.error('Failed to remove lens:', error);
      throw error;
    }
  }

  async cleanup() {
    if (!this.initialized) return;

    try {
      await this.session.pause();
      await this.session.dispose();
      this.initialized = false;
      console.log('Camera Kit cleaned up successfully');
    } catch (error) {
      console.error('Failed to cleanup Camera Kit:', error);
    }
  }
}

window.cameraKit = new CameraKit();