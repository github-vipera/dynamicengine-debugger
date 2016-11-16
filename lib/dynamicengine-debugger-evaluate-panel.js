'use babel';


module.exports = {
  render : function() {
    return `
  <div>
      <atom-panel class="tool-panel">

        <div class="panel-heading">
          <span class="header-item description">Dynamic Engine remote javascript evaluation</span>

          <div class="heading-buttons inline-block pull-right">
            <div class="heading-close inline-block icon-x" style="cursor: pointer;" click="close" id="deevaluatepanel-btn-hidepanel"></div>
          </div>
        </div>

        <div class="panel-body">
          <div class='inline-block padded' style="padding-bottom:0px;">
            <button id='deevaluatepanel-btn-run' class='inline-block-tight btn'><span class="icon icon-playback-play"></span></span>Evaluate</button>
            <button id='deevaluatepanel-btn-clear' class='inline-block-tight btn'><span class='icon icon-trashcan'></span>Clear</button>
          </div>

          <div class='block padded'>
            <textarea id='deevaluatepanel-txt-script' class='input-textarea native-key-bindings' placeholder='Javascript Source' style="height:150px"></textarea>
          </div>
        </div>

      <atom-panel>


  </div>

`}

}
