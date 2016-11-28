'use babel';
module.exports = {
  render : function() {
    return `
      <div style='padding:8px; margins:8px;'>
            <div class='block padded'>
              <button id='script-btn-run' class='inline-block-tight btn'><span class="icon icon-playback-play"></span></span>Run dev script</button>
              <button id='script-btn-stop' class='inline-block-tight btn'><span class='icon icon-primitive-square'></span>Stop</button>
            </div>
            <div id="script-status-indicator" style="height:2px;background:#565656;"></div>
      </div>

      <atom-panel class='padded'>
        <div class="inset-panel">
          <div class="panel-heading"><span class='icon icon-settings'></span>Script setup<span class='text-subtle'>&nbsp;&nbsp;(NB: execute an npm install in your project folder before)</span></div>
          <div class="panel-body padded">
            <div class='block'>
              <label>Script name (defined as a script in your package.json file). Use this for integrate external tools
                like watchify and browserify
              </label>
              <input id='script-name' type='text' class='input-text native-key-bindings' placeholder='Your script name'>
            </div>
          </div>
        </div>
      </atom-panel>
  `}

}
