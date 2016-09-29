import React from 'react';
import $ from 'jquery';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.toggleAvatarClip = this.toggleAvatarClip.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.addGlasses = this.addGlasses.bind(this);
    this.removeObject = this.removeObject.bind(this);
    this.saveAvatar = this.saveAvatar.bind(this);
  }

  componentDidMount() {
    this.canvas = new fabric.Canvas('avatar');
    fabric.Object.prototype.transparentCorners = false;

    // document.getElementById('colorPicker').addEventListener('change', function() {
    //   console.log(this.value);
    //   this.canvas.getActiveObject().setFill(this.value);
    // });
  }

  componentDidUpdate() {
    const _this = this;
    let img = new Image;
    let src = this.props.avatar;

    img.crossOrigin = 'Anonymous';
    img.src = src;

    img.onload = function() {
      console.log('img', img);

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
    console.log('data', this.canvas.toDataURL());
  }

  addGlasses() {
    const _this = this;
    fabric.loadSVGFromURL('img/avatar/sunglass.svg', function(object, options) {
      var shape = fabric.util.groupSVGElements(object, options);
      shape.scale(0.25);
      //shape.paths[0].setFill('rgb(150,0,0)');
      document.getElementById('colorPicker').value = shape.paths[0].getFill();
      shape.center();
      shape.centeredScaling = true;
      shape.paths[0];
      shape.setFill = function(color) {
        shape.paths[0].setFill(color);
        _this.canvas.renderAll();
      }

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
              <input type="color" id="colorPicker" onChange={(e) => { this.handleColorChange(e.currentTarget.value); }} />
            </div>
            <div className="col-sm-12">
              <div className="row">
                <div className="col-sm-6">
                  <div className="panel">
                    <button id="addGlasses" className="btn btn-default" onClick={this.addGlasses}>
                      <img src="/img/avatar/sunglass.svg" alt="sunglasses" width="100" height="40" />
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