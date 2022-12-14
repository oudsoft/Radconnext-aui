/*case-event-log-msg.js*/
module.exports = function ( jq, ut, cm ) {

	const $ = jq;
  //const util = require('./utilmod.js')($);
  const util = ut;
  const common = cm;

  const doCreateClokRemark = function(triggerAt){
    let yymmddhhmnss = triggerAt;
    let yymmddhhmnText = util.fmtStr('%s-%s-%s %s:%s:%s', yymmddhhmnss.YY, yymmddhhmnss.MM, yymmddhhmnss.DD, yymmddhhmnss.HH, yymmddhhmnss.MN, yymmddhhmnss.SS);
    console.log(yymmddhhmnText);
    let triggerDT = new Date(yymmddhhmnText);
    console.log(triggerDT);
    let d = new Date();
    console.log(d);
    let diffTime = Math.abs(triggerDT - d);
    let hh = parseInt(diffTime/(1000*60*60));
    let mn = parseInt((diffTime - (hh*1000*60*60))/(1000*60));
    let clockFrag = $('<span></span>').countdownclock({countToHH: hh, countToMN: mn});
    let clockCountdownDiv = $('<span id="ClockCountDownBox"></span>').css({'margin-left': '10px'});
    $(clockCountdownDiv).append($(clockFrag.hhFrag)).append($(clockFrag.coFrag)).append($(clockFrag.mnFrag))
    return $(clockCountdownDiv);
  }

  const doCallTaskDirect = function(url, caseId) {
    return new Promise(async function(resolve, reject) {
      let taskRes = await common.doGetApi(url, {});
      let tasks = taskRes.Records;
      let task = await tasks.find((item)=>{
        if (item.caseId == caseId) {
          return item;
        }
      });
      if (task) {
        let taskTriggerAt = util.formatDateTimeDDMMYYYYJSON(task.triggerAt);
        let clockCountdownBox = doCreateClokRemark(taskTriggerAt);
        resolve($(clockCountdownBox));
      } else {
        resolve();
      }
    })
  }

  const onNewEventMsg = function(box, data) {
    let caseKey = data.remark.indexOf('สร้างเคส');
    if (data.triggerAt) {
      let lineKey = data.remark.indexOf('Line');
      if (lineKey >= 0) {
        $(box).data('expireTriggerAt', data.triggerAt);
      }
      let voipKey = data.remark.indexOf('VOIP');
      if (voipKey >= 0) {
        $(box).empty();
        $(box).append($('<div></div>').text('แจ้งรังสีแพทย์รับเคสทาง Line แล้ว'));
        let clockCountdownDiv = doCreateClokRemark(data.triggerAt);
        let remark1 = $('<span></span>').text('จะโทรตามภายใน');
        let remark2 = $('<span></span>').text('นาที').css({'margin-left': '10px'});
        let callBox = $(box).find('#CallTrigger');
        console.log(callBox.length);
        if (callBox.length == 0) {
          $(box).append($('<div id="CallTrigger"></div>').append($(remark1)).append($(clockCountdownDiv)).append($(remark2)));
        } else {
          $(callBox).empty();
          $(callBox).append($(remark1)).append($(clockCountdownDiv)).append($(remark2));
          $(box).append($(callBox));
        }
        let expireTriggerAt = $(box).data('expireTriggerAt');
        if (expireTriggerAt) {
          let yymmddhhmnss2 = expireTriggerAt;
          let yymmddhhmnText2 = util.fmtStr('%s-%s-%s %s:%s:%s', yymmddhhmnss2.YY, yymmddhhmnss2.MM, yymmddhhmnss2.DD, yymmddhhmnss2.HH, yymmddhhmnss2.MN, yymmddhhmnss2.SS);
          console.log(yymmddhhmnText2);
          let triggerDT2 = new Date(yymmddhhmnText2);
          console.log(triggerDT2);
          let d2 = new Date();
          console.log(d2);
          let diffTime2 = Math.abs(triggerDT2 - d2);
          let hh2 = parseInt(diffTime2/(1000*60*60));
          let mn2 = parseInt((diffTime2 - (hh2*1000*60*60))/(1000*60));
          let clockFrag2 = $('<span></span>').countdownclock({countToHH: hh2, countToMN: mn2});
          let clockCountdownDiv2 = $('<span id="ClockCountDownBox"></span>').css({'margin-left': '10px'});
          $(clockCountdownDiv2).append($(clockFrag2.hhFrag)).append($(clockFrag2.coFrag)).append($(clockFrag2.mnFrag))
          let remark3 = $('<span></span>').text('เวลารับเคสที่เหลือ');
          let remark4 = $('<span></span>').text('นาที').css({'margin-left': '10px'});
          $(box).append($('<div></div>').append($(remark3)).append($(clockCountdownDiv2)).append($(remark4)));
        }
      } else {
        $(box).empty();
        $(box).append($('<div></div>').text('แจ้งรังสีแพทย์รับเคสทาง Line แล้ว'));
        let callUrl = '/api/voiptask/list';
        doCallTaskDirect(callUrl, data.caseId).then((clockBox)=>{
          if (clockBox) {
            let callBox = $(box).find('#CallTrigger');
            //console.log(callBox);
            if (callBox.length == 0) {
              let remark1 = $('<span></span>').text('จะโทรตามภายใน');
              let remark2 = $('<span></span>').text('นาที').css({'margin-left': '10px'});
              $(box).append($('<div id="CallTrigger"></div>').append($(remark1)).append($(clockCountdownDiv)).append($(remark2)));
            }
          } else {
            let remark1 = $('<span></span>').text('รังสีแพทย์ไม่ได้ตั้งค่าให้โทรอัตโนมัติ');
            $(box).append($('<div></div>').append($(remark1)));
          }
        });
      }
    } else {
      if (caseKey >= 0) {
        $(box).empty();
        $(box).append($('<div></div>').text('สร้างเคสสำเร็จ'));
        let remark1 = $('<span></span>').text('รอ Upload Zip ไฟล์');
        $(box).append($('<div></div>').append($(remark1)));
      } else {
        let callUrl = '/api/tasks/task/list';
        doCallTaskDirect(callUrl, data.caseId).then((clockBox)=>{
          if (clockBox) {
            let remark1 = $('<span></span>').text('เวลาตอบรับที่เหลือ');
            let remark2 = $('<span></span>').text('นาที').css({'margin-left': '10px'});
            $(box).append($('<div></div>').append($(remark1)).append($(clockBox)).append($(remark2)));
          } else {
            $(box).empty();
            $(box).append($('<div></div>').text('Upload แล้ว'));
            let remark1 = $('<span></span>').text('รังสีแพทย์ไม่ได้ตั้งค่าให้แจ้งเตือนใดๆ');
            $(box).append($('<div></div>').append($(remark1)));
          }
        });
      }
    }
  }

  const onAcceptEventMsg = function(box, data) {
    $(box).empty();
    $(box).append($('<div></div>').text('รังสีแพทย์รับเคสแล้ว'));
    if (data.triggerAt) {
      let clockCountdownDiv = doCreateClokRemark(data.triggerAt);
      let remark1 = $('<span></span>').text('เวลาส่งผลที่เหลือ');
      let remark2 = $('<span></span>').text('นาที').css({'margin-left': '10px'});
      $(box).append($('<div></div>').append($(remark1)).append($(clockCountdownDiv)).append($(remark2)));
    } else {
      let callUrl = '/api/tasks/task/list';
      doCallTaskDirect(callUrl, data.caseId).then((clockBox)=>{
        if (clockBox) {
          let remark1 = $('<span></span>').text('เวลาส่งผลที่เหลือ');
          let remark2 = $('<span></span>').text('นาที').css({'margin-left': '10px'});
          $(box).append($('<div></div>').append($(remark1)).append($(clockBox)).append($(remark2)));
        }
      });
    }
  }

  const onOpenEventMsg = function(box, data) {
    $(box).empty();
    $(box).append($('<div></div>').text('รังสีแพทย์เปิดดูเคสแล้ว'));
    if (data.triggerAt) {
      let clockCountdownDiv = doCreateClokRemark(data.triggerAt);
      let remark1 = $('<span></span>').text('เวลาส่งผลที่เหลือ');
      let remark2 = $('<span></span>').text('นาที').css({'margin-left': '10px'});
      $(box).append($('<div></div>').append($(remark1)).append($(clockCountdownDiv)).append($(remark2)));
    } else {
      let callUrl = '/api/tasks/task/list';
      doCallTaskDirect(callUrl, data.caseId).then((clockBox)=>{
        if (clockBox) {
          let remark1 = $('<span></span>').text('เวลาส่งผลที่เหลือ');
          let remark2 = $('<span></span>').text('นาที').css({'margin-left': '10px'});
          $(box).append($('<div></div>').append($(remark1)).append($(clockBox)).append($(remark2)));
        }
      });
    }
  }

  const onDraftEventMsg = function(box, data) {
    $(box).empty();
    $(box).append($('<div></div>').text('กำลังอ่านผล'));
    if (data.triggerAt) {
      let clockCountdownDiv = doCreateClokRemark(data.triggerAt);
      let remark1 = $('<span></span>').text('กำหนดส่งผลในอีก');
      let remark2 = $('<span></span>').text('นาที').css({'margin-left': '10px'});
      $(box).append($('<div></div>').append($(remark1)).append($(clockCountdownDiv)).append($(remark2)));
    } else {
      doCallTaskDirect(data.caseId).then((clockBox)=>{
        if (clockBox) {
          let remark1 = $('<span></span>').text('เวลาส่งผลที่เหลือ');
          let remark2 = $('<span></span>').text('นาที').css({'margin-left': '10px'});
          $(box).append($('<div></div>').append($(remark1)).append($(clockBox)).append($(remark2)));
        }
      });
    }
  }

  const onExpiredEventMsg = function(box, data) {
    $(box).empty();
    $(box).append($('<div></div>').text('หมดเวลาอ่านผล'));
    let remark1 = $('<span></span>').text('รังสีแพทย์อ่านผลค้างไว้ กรุณาติดต่อรังสีแพทย์');
    $(box).append($('<div></div>').append($(remark1)));
  }

  const doCreateEventLogMsgBox = function(box, data) {
    let caseBoxData = $(box).data('caseData');
    if (data.caseId == caseBoxData.case.id) {
      if ([3, 4, 7].includes(Number(data.to))) {
				$(box).parent().css({'background-color': '#EB984E', 'border': '1px solid black'});
			} else {
				$(box).parent().css({'background-color': '#28B463', 'border': '1px solid black'});
			}
			if (data.progress) {
				$(box).empty();
				$(box).append($('<div></div>').text('Uploading'));
				$(box).append($('<div></div>').text('Progress ' + data.progress + '%'));
			} else {
        if ([5, 10, 11, 12, 13, 14].includes(Number(data.to))) {
					$(box).empty();
					$(box).append($('<div></div>').text('ส่งผลแล้ว'));
				} else {
          if ([1].includes(Number(data.to))) {
            onNewEventMsg(box, data);
          } else if ([2].includes(Number(data.to))) {
            onAcceptEventMsg(box, data);
          } else if ([8].includes(Number(data.to))) {
            onOpenEventMsg(box, data)
          } else if ([9].includes(Number(data.to))) {
            onDraftEventMsg(box, data);
          } else if ([4].includes(Number(data.to))) {
            onExpiredEventMsg(box, data);
          }
        }
      }
    }
  }

  return {
    doCreateClokRemark,
    doCallTaskDirect,
    doCreateEventLogMsgBox
	}
}
