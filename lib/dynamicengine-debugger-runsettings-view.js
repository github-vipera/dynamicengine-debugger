'use babel';


module.exports = {
  render : function() {
    return `
    <img class="va-white-logo" src="atom://dynamicengine-debugger/resources/VA_white.png" style="position:absolute;opacity:0.05;bottom:4px;right:4px;height:110px;">
  <div style='padding:8px; margins:8px;'>

        <div class='block padded'>
          <button id='derunsettings-btn-run' class='inline-block-tight btn'><span class="icon icon-playback-play"></span></span>Run</button>
          <button id='derunsettings-btn-stop' class='inline-block-tight btn'><span class='icon icon-primitive-square'></span>Stop</button>
          <button id='derunsettings-btn-liveReload' class='inline-block-tight btn'><span class='icon icon-repo-sync'></span>Live Reload</button>
          <button id='derunsettings-btn-openLogPane' class='inline-block-tight btn icon icon-terminal' title='Log Pane'></button>
          <button id='derunsettings-btn-openChrome' class='inline-block-tight btn icon icon-eye-watch' title='Open Chrome'></button>
          <button id='derunsettings-btn-openIOSEmulator' class='inline-block-tight btn icon icon-device-mobile' title='Open IOS Emulator'></button>
          <button id='derunsettings-btn-toggleEvaluateTool' class='inline-block-tight btn icon icon-code' title='Toggle Evaluate Tool'></button>
        </div>

        <div id="derunsettings-status-indicator" style="height:2px;background:#565656;"></div>

        <atom-panel class='padded'>
          <div class="inset-panel">
            <div class="panel-heading"><span class='icon icon-file-directory'></span>Source Paths<span class='text-subtle'>&nbsp;&nbsp;(Drop from Workspace treeview)</span></div>
            <div class="panel-body padded">
              <div class='block'>
                <label>Root Assets Folder</label>
                <input id='derunsettings-txt-rootFolder' type='text' class='input-text native-key-bindings'  placeholder='Assets Root Folder'>
              </div>
              <div class='block'>
                <label>Index file</label>
                <input id='derunsettings-txt-indexFile' type='text' class='input-text native-key-bindings inline-block' placeholder='Index File'>
              </div>
              <div class='block'>
                <label>Server Mock Implementation</label>
                <input id='derunsettings-txt-serverMockImpl' type='text' class='input-text native-key-bindings' placeholder='Server Mock Implementation'>
              </div>
              <div class='block'>
                <label>Mock library loader</label>
                <input id='derunsettings-txt-libraryloader' type='text' class='input-text native-key-bindings' placeholder='library loader path'>
              </div>
              <div class='block'>
                <label>Native storage directory</label>
                <input id='derunsettings-txt-localdatabase' type='text' class='input-text native-key-bindings' placeholder='native storage directory'>
              </div>
            </div>
          </div>
        </atom-panel>

        <atom-panel class='padded'>
          <div class="inset-panel">
            <div class="panel-heading"><span class='icon icon-settings'></span>Emulation Settings</div>
            <div class="panel-body padded">
              <div class='block'>
                <label class='input-label'><input id='derunsettings-tog-physicalDevice' class='input-toggle' type='checkbox' unchecked>Run on Physical Device</label>
              </div>
              <div class='block'>
                <div class='select-list popover-list'>
                  <label>Emulated device OS on browser</label>
                  <select id='derunsettings-sel-deviceOs' class='input-select'>
                    <option value="ios" selected>iOS</option>
                    <option value="android">Android</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </atom-panel>

  </div>

`}

}
