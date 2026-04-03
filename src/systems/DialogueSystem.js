export default class DialogueSystem {
  constructor(scene) {
    this.scene = scene;
    this.visible = false;
    this.lines = [];
    this.index = 0;
    this.onComplete = null;
    this.speaker = '';
    this.createUI();
  }

  createUI() {
    const { width, height } = this.scene.scale;

    this.container = this.scene.add.container(0, 0).setDepth(1000).setScrollFactor(0);
    this.panel = this.scene.add.rectangle(width / 2, height - 90, width - 40, 140, 0x0b1324, 0.94)
      .setStrokeStyle(2, 0xf9d38b, 0.9);
    this.title = this.scene.add.text(32, height - 170, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#f9d38b'
    });
    this.text = this.scene.add.text(32, height - 140, '', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#f2f5ff',
      wordWrap: { width: width - 64 }
    });
    this.hint = this.scene.add.text(width - 250, height - 40, 'Tap / Space to continue', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#8dc8ff'
    });

    this.container.add([this.panel, this.title, this.text, this.hint]);
    this.container.setVisible(false);
  }

  open({ speaker = '', lines = [], onComplete = null }) {
    this.visible = true;
    this.lines = lines;
    this.index = 0;
    this.onComplete = onComplete;
    this.speaker = speaker;
    this.container.setVisible(true);
    this.render();
  }

  render() {
    const line = this.lines[this.index] ?? '';
    this.title.setText(this.speaker ? `${this.speaker}` : '');
    this.text.setText(line);
  }

  next() {
    if (!this.visible) {
      return false;
    }

    this.index += 1;
    if (this.index >= this.lines.length) {
      this.close();
      return true;
    }

    this.render();
    return false;
  }

  close() {
    this.visible = false;
    this.container.setVisible(false);
    this.text.setText('');
    this.title.setText('');
    if (typeof this.onComplete === 'function') {
      const cb = this.onComplete;
      this.onComplete = null;
      cb();
    }
  }
}
