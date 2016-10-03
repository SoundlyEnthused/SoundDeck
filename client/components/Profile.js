import React from 'react';
import $ from 'jquery';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.toggleAvatarClip = this.toggleAvatarClip.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.removeObject = this.removeObject.bind(this);
    this.saveAvatar = this.saveAvatar.bind(this);

    this.addGlasses = this.addGlasses.bind(this);
    this.addCap = this.addCap.bind(this);
    this.addFedora = this.addFedora.bind(this);
    this.addTophat = this.addTophat.bind(this);
    this.addCrown = this.addCrown.bind(this);
    this.addTiara = this.addTiara.bind(this);
    this.addChain = this.addChain.bind(this);
  }

  componentDidMount() {
    const picker = document.getElementById('colorPicker');
    this.canvas = new fabric.Canvas('avatar');
    fabric.Object.prototype.transparentCorners = false;

    this.canvas.on('object:selected', (e) => {
      if (e.target.id !== 'chain') {
        picker.value = e.target.paths[0].getFill();
        picker.classList.remove('hidden');
      } else {
        picker.classList.add('hidden');
      }
    });

    this.canvas.on('selection:cleared', (e) => {
      picker.classList.add('hidden');
    });
  }

  componentDidUpdate() {
    const _this = this;
    let img = new Image;
    let src = this.props.avatar;

    img.crossOrigin = 'Anonymous';
    img.src = src;

    img.onload = function() {
      //console.log('img', img);

      var newImage = new fabric.Image(img, {
        width: 200,
        height: 200,
        // Set the center of the new object based on the event coordinates relative
        // to the canvas container.
        left: 0,
        top: 0,
        selectable: false,
      });
      _this.canvas.add(newImage);
    };
  } // did update


  toggleAvatarClip() {
    document.getElementsByTagName('canvas')[0].classList.toggle('clip');
  }

  removeObject() {
    this.canvas.getActiveObject().remove();
  }

  handleColorChange(color) {
    console.log(color);
    this.canvas.getActiveObject().setFill(color);
  }

  saveAvatar() {
    localStorage.soundDeck = this.canvas.toDataURL();
  }

  addGlasses() {
    const _this = this;
    fabric.loadSVGFromURL('img/avatar/sunglass.svg', function(object, options) {
      var shape = fabric.util.groupSVGElements(object, options);
      shape.scale(0.25);
      //document.getElementById('colorPicker').value = shape.paths[0].getFill();
      shape.center();
      shape.centeredScaling = true;
      shape.id = 'glasses';
      shape.setFill = (color) => {
        shape.paths[0].setFill(color);
        _this.canvas.renderAll();
      };

      _this.canvas.add(shape).setActiveObject(shape);
      _this.canvas.renderAll();
    });
  }

  addCap() {
    const _this = this;
    fabric.loadSVGFromURL('img/avatar/cap.svg', function(object, options) {
      var shape = fabric.util.groupSVGElements(object, options);
      shape.scale(0.25);
      //document.getElementById('colorPicker').value = shape.paths[0].getFill();
      shape.center();
      shape.centeredScaling = true;
      shape.id = 'cap';
      shape.setFill = (color) => {
        shape.paths[0].setFill(color);
        _this.canvas.renderAll();
      };

      _this.canvas.add(shape).setActiveObject(shape);
      _this.canvas.renderAll();
    });
  }
  addFedora() {
    const _this = this;
    fabric.loadSVGFromURL('img/avatar/fedora.svg', function(object, options) {
      var shape = fabric.util.groupSVGElements(object, options);
      shape.scale(0.65);
      //document.getElementById('colorPicker').value = shape.paths[0].getFill();
      shape.center();
      shape.centeredScaling = true;
      shape.id = 'fedora';
      shape.setFill = (color) => {
        shape.paths[0].setFill(color);
        _this.canvas.renderAll();
      };

      _this.canvas.add(shape).setActiveObject(shape);
      _this.canvas.renderAll();
    });
  }

  addTophat() {
    const _this = this;
    fabric.loadSVGFromURL('img/avatar/tophat.svg', function(object, options) {
      var shape = fabric.util.groupSVGElements(object, options);
      shape.scale(0.25);
      //document.getElementById('colorPicker').value = shape.paths[0].getFill();
      shape.center();
      shape.centeredScaling = true;
      shape.id = 'tophat';
      shape.setFill = (color) => {
        shape.paths[0].setFill(color);
        _this.canvas.renderAll();
      };

      _this.canvas.add(shape).setActiveObject(shape);
      _this.canvas.renderAll();
    });
  }

  addCrown() {
    const _this = this;
    fabric.loadSVGFromURL('img/avatar/crown.svg', function(object, options) {
      var shape = fabric.util.groupSVGElements(object, options);
      shape.scale(0.25);
      //document.getElementById('colorPicker').value = shape.paths[0].getFill();
      shape.center();
      shape.centeredScaling = true;
      shape.id = 'crown';
      shape.setFill = (color) => {
        shape.paths[0].setFill(color);
        _this.canvas.renderAll();
      };

      _this.canvas.add(shape).setActiveObject(shape);
      _this.canvas.renderAll();
    });
  }

  addTiara() {
    const _this = this;
    fabric.loadSVGFromURL('img/avatar/tiara.svg', function(object, options) {
      var shape = fabric.util.groupSVGElements(object, options);
      shape.scale(0.25);
      //document.getElementById('colorPicker').value = shape.paths[0].getFill();
      shape.center();
      shape.centeredScaling = true;
      shape.id = 'tiara';
      shape.setFill = (color) => {
        shape.paths[0].setFill(color);
        _this.canvas.renderAll();
      };

      _this.canvas.add(shape).setActiveObject(shape);
      _this.canvas.renderAll();
    });
  }

  addChain() {
    const _this = this;
    fabric.loadSVGFromURL('img/avatar/chain.svg', function(object, options) {
      var shape = fabric.util.groupSVGElements(object, options);
      shape.scale(0.25);
      shape.center();
      shape.id = "chain";
      shape.centeredScaling = true;

      _this.canvas.add(shape).setActiveObject(shape);
      _this.canvas.renderAll();
    });
  }

  render() {
    return (
      <div id="profile" className="profile collapse">
        <div className="container">
          <h1 className="profile--title">
            Profile: {this.props.username}
          </h1>
          <div className="row">
            <div className="col-sm-12">
              <button id="saveAvatar" className="btn btn-danger" onClick={this.saveAvatar}>Save</button>
              <button id="clipBtn" className="btn btn-default" onClick={this.toggleAvatarClip}>Toggle Clipping Mask</button>
              <button id="remove" className="btn btn-default" onClick={this.removeObject}>Delete Active Object</button>
              <div className="profile--colorPicker">
                <input
                  type="color"
                  id="colorPicker"
                  className="hidden"
                  onChange={(e) => { this.handleColorChange(e.currentTarget.value); }} 
                />
              </div>
            </div>
            <div className="col-sm-12">
              <div className="row">

                <div className="col-sm-6">
                  <div className="panel">
                    <button id="addGlasses" className="btn btn-default" onClick={this.addGlasses}>
                      <img src="/img/avatar/sunglass.svg" alt="sunglasses" width="100" height="40" />
                    </button>
                    <button className="btn btn-default" onClick={this.addCap}>
                      <img src="/img/avatar/cap.svg" alt="cap" width="60" />
                    </button>
                    <button className="btn btn-default" onClick={this.addFedora}>
                      <img src="/img/avatar/fedora.svg" alt="fedora" width="60" />
                    </button>
                    <button className="btn btn-default" onClick={this.addTophat}>
                      <img src="/img/avatar/tophat.svg" alt="tophat" width="60" />
                    </button>
                    <button className="btn btn-default" onClick={this.addCrown}>
                      <img src="/img/avatar/crown.svg" alt="crown" width="60" />
                    </button>
                    <button className="btn btn-default" onClick={this.addTiara}>
                      <img src="/img/avatar/tiara.svg" alt="tiara" width="60" />
                    </button>
                    <button className="btn btn-default" onClick={this.addChain}>
                      <img src="/img/avatar/chain.svg" alt="chain" width="60" />
                    </button>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="panel">
                    <canvas id="avatar" className="profile--avatar" width="200" height="200" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}