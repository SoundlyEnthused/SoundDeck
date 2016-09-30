// Progress Bar
// Friday, September 30, 2016
// 11:10 am - Pre-Change


// Workup
<div id="vote" className="vote row">
	<div className="col-xs-4 vote--meter">
		<p>Downvotes</p>
		<div className="progress">
		  <div
		    className="progress-bar progress-bar-danger progress-bar-striped active"
		    role="progressbar"
		    aria-valuenow={this.state.downvoteCount}
		    aria-valuemin="0"
		    aria-valuemax={this.state.users.length + this.state.djs.filter(d => d).length}
		    style={ {width: this.updateProgressBarWidth} }  	
		  />
	</div>
</div>

updateProgressBarWidth() {
  let downvoteCount = this.state.downvoteCount;
  let numUsers = this.state.users.length;
  let numDJs = this.state.djs.filter(d => d).length;
  
  //`${(this.state.downvoteCount / (this.state.users.length + this.state.djs.filter(d => d).length)) * 100}%` }
  let width = downvoteCount / (numUsers + numDJs);
  console.log('width = ', width);
  return width;	
}







// Initial
<div id="vote" className="vote row">
	<div className="col-xs-4 vote--meter">
		<p>Downvotes</p>
		<div className="progress">
		  <div
		    className="progress-bar progress-bar-danger progress-bar-striped active"
		    role="progressbar"
		    aria-valuenow={this.state.downvoteCount}
		    aria-valuemin="0"
		    aria-valuemax={this.state.users.length + this.state.djs.filter(d => d).length}
		    style={{ width: `${(this.state.downvoteCount / (this.state.users.length + this.state.djs.filter(d => d).length)) * 100}%` }}
		  />
	</div>
</div>


