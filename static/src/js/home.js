$(document).ready(function() {

    var count = 1;

    fetch('./api/terms')
        .then(function (response) {
            if(response.status != 200) {
                console.log("error. Status code "+response.status);
                return;
            }

            response.json()
            .then(function(data) {
                console.log(data.terms)
                for(var i = 0; i < data.terms.length; ++i) {
                    
                    var segment = document.createElement('div');
                    segment.setAttribute('class', 'ui massive segment');

                    var label = document.createElement('label');
                    label.innerHTML = data.terms[i].title;
                    segment.appendChild(label);


                    var removeId = 'remove'+data.terms[i].id;
                    var remove = document.createElement('a');
                    remove.setAttribute('class', 'ui right corner red label');
                    var icon = document.createElement('i');
                    icon.setAttribute('class', 'remove icon');
                    remove.setAttribute('id', removeId);
                    remove.appendChild(icon);
                    segment.appendChild(remove);


                    var divider = document.createElement('div');
                    divider.setAttribute('class', 'ui divider');
                    segment.appendChild(divider);

                    var horizontal = document.createElement('div');
                    horizontal.setAttribute('class', 'ui horizontal segments');

                    var leftSegment = document.createElement('div');
                    leftSegment.setAttribute('class', 'ui segment');
                    leftSegment.innerHTML = String(data.terms[i].start_date).replace(/,.*/gi,' ');

                    var leftLabel = document.createElement('div');
                    leftLabel.setAttribute('class', 'ui yellow horizontal label');
                    leftLabel.innerHTML = 'Start';

                    leftSegment.appendChild(leftLabel);
                    horizontal.appendChild(leftSegment);

                    var rightSegment = document.createElement('div');
                    rightSegment.setAttribute('class', 'ui segment');
                    rightSegment.innerHTML = String(data.terms[i].end_date).replace(/,.*/gi,' ');;

                    var rightLabel = document.createElement('div');
                    rightLabel.setAttribute('class', 'ui green horizontal label');
                    rightLabel.innerHTML = 'End';

                    rightSegment.appendChild(rightLabel);
                    horizontal.appendChild(rightSegment);

                    segment.appendChild(horizontal);

                    var divider1 = document.createElement('div');
                    divider1.setAttribute('class', 'ui divider');

                    segment.appendChild(divider1);



                    var progress = document.createElement('div');
                    progress.setAttribute('class', 'ui indicating progress');
                    var id = 'example'+count;
                    progress.setAttribute('id', id);

                    var start = Date.parse(data.terms[i].start_date);
                    var end = Date.parse(data.terms[i].end_date);

                    var today = new Date();
                    var diff = end-start;
                    var currentDiff = today - start;
                    diff = Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));
                    currentDiff = Math.ceil(currentDiff / (1000 * 60 * 60 * 24 * 7));
                    
                    if(currentDiff - diff >= 0) {
                        currentDiff = diff;
                    }
                    if(currentDiff <= 0) {
                        currentDiff = 0;
                    }

                    progress.setAttribute('data-value', currentDiff);
                    progress.setAttribute('data-total', diff);
                    
                    var bar = document.createElement('div');
                    bar.setAttribute('class', 'bar');
                    progress.appendChild(bar);

                    var progLabel = document.createElement('label');
                    progLabel.innerHTML = 'Week';
                    progLabel.setAttribute('class', 'label');
                    progress.appendChild(progLabel);

                    segment.appendChild(progress);

                    var view = document.createElement('button');
                    var buttonId = 'button'+data.terms[i].id;
                    view.setAttribute('class', 'fluid blue ui button')
                    view.setAttribute('id', buttonId);
                    view.innerHTML = 'View';
                    
                    segment.appendChild(view);

                    $('#list').append(segment);


                    // ========================= MOBILE ======================= //
                    segment = document.createElement('div');
                    segment.setAttribute('class', 'ui massive segment');

                    label = document.createElement('label');
                    label.innerHTML = data.terms[i].title;
                    segment.appendChild(label);


                    removeId = 'm-remove'+data.terms[i].id;
                    remove = document.createElement('a');
                    remove.setAttribute('class', 'ui right corner red label');
                    icon = document.createElement('i');
                    icon.setAttribute('class', 'remove icon');
                    remove.setAttribute('id', removeId);
                    remove.appendChild(icon);
                    segment.appendChild(remove);


                    divider = document.createElement('div');
                    divider.setAttribute('class', 'ui divider');
                    segment.appendChild(divider);

                    horizontal = document.createElement('div');
                    horizontal.setAttribute('class', 'ui segments');

                    leftSegment = document.createElement('div');
                    leftSegment.setAttribute('class', 'ui segment');
                    // leftSegment.innerText = String(data.terms[i].start_date).replace(/,.*/gi,' ');

                    leftLabel = document.createElement('div');
                    leftLabel.setAttribute('class', 'ui yellow horizontal label');
                    leftLabel.innerText = 'Start';

                    leftSegment.appendChild(leftLabel);
                    leftSegment.insertAdjacentText('beforeend', String(data.terms[i].start_date).replace(/,.*/gi,' '));
                    horizontal.appendChild(leftSegment);

                    rightSegment = document.createElement('div');
                    rightSegment.setAttribute('class', 'ui segment');
                    // rightSegment.innerText = String(data.terms[i].end_date).replace(/,.*/gi,' ');;

                    rightLabel = document.createElement('div');
                    rightLabel.setAttribute('class', 'ui green horizontal label');
                    rightLabel.innerText = 'End';

                    rightSegment.appendChild(rightLabel);
                    rightSegment.insertAdjacentText('beforeend', String(data.terms[i].end_date).replace(/,.*/gi,' '));
                    
                    horizontal.appendChild(rightSegment);

                    segment.appendChild(horizontal);

                    divider1 = document.createElement('div');
                    divider1.setAttribute('class', 'ui divider');

                    segment.appendChild(divider1);



                    progress = document.createElement('div');
                    progress.setAttribute('class', 'ui indicating progress');
                    id = 'm-example'+count;
                    progress.setAttribute('id', id);

                    start = Date.parse(data.terms[i].start_date);
                    end = Date.parse(data.terms[i].end_date);

                    today = new Date();
                    diff = end-start;
                    currentDiff = today - start;
                    diff = Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));
                    currentDiff = Math.ceil(currentDiff / (1000 * 60 * 60 * 24 * 7));
                    
                    if(currentDiff - diff >= 0) {
                        currentDiff = diff;
                    }
                    if(currentDiff <= 0) {
                        currentDiff = 0;
                    }

                    progress.setAttribute('data-value', currentDiff);
                    progress.setAttribute('data-total', diff);
                    
                    bar = document.createElement('div');
                    bar.setAttribute('class', 'bar');
                    progress.appendChild(bar);

                    progLabel = document.createElement('label');
                    progLabel.innerHTML = 'Week';
                    progLabel.setAttribute('class', 'label');
                    progress.appendChild(progLabel);

                    segment.appendChild(progress);

                    view = document.createElement('button');
                    buttonId = 'm-button'+data.terms[i].id;
                    view.setAttribute('class', 'fluid blue ui button')
                    view.setAttribute('id', buttonId);
                    view.innerHTML = 'View';
                    
                    segment.appendChild(view);

                    $('#list1').append(segment);


                    count += 1;
                }
                return data;
            }).then((data) => {
                var prefix ="#example";
                var prefix1 = "#button";
                var prefix2 = "#remove"

                var prefix3 ="#m-example";
                var prefix4 = "#m-button";
                var prefix5 = "#m-remove"
                for(var n = 0; n < data.terms.length; ++n) {
                    // Must Strictly use const, otherwise wont work
                    const num = data.terms[n].id;
                    $(prefix1+num).click(() => {
                        window.location.href = '/term'+num;
                    })
                    $(prefix2+num).click(() => {
                        window.location.href = '/term'+num+'/delete';
                    })

                    $(prefix4+num).click(() => {
                        window.location.href = '/term'+num;
                    })
                    $(prefix5+num).click(() => {
                        window.location.href = '/term'+num+'/delete';
                    })

                    
                    
                }
                for(var i = 1; i <= count-1; ++i) {
                    var id = prefix + i;
                    $(id).progress({
                        text: {
                            active  : 'Week {value} of {total}',
                            success : 'End of Term! Week {value} of {total}',
                        }
                    });
                    var id1 = prefix3 + i;
                    $(id1).progress({
                        text: {
                            active  : 'Week {value} of {total}',
                            success : 'End of Term! Week {value} of {total}',
                        }
                    });
                    
                }
            }).then(() => {
                var button = document.createElement('div');
                button.setAttribute('class', 'ui fluid button teal');
                button.setAttribute('id', 'button');
                var buttonLabel = document.createElement('label');
                buttonLabel.innerHTML = 'Add New term';
                button.appendChild(buttonLabel);
                
                var button1 = document.createElement('div');
                button1.setAttribute('class', 'ui fluid button teal');
                button1.setAttribute('id', 'm-button');
                var buttonLabel1 = document.createElement('label');
                buttonLabel1.innerHTML = 'Add New term';
                button1.appendChild(buttonLabel1);

                $('#list').append(button);
                $('#list1').append(button1);
                
                $('#button').click(() => {
                    window.location.href = '/add/term';
                })

                $('#m-button').click(() => {
                    window.location.href = '/add/term';
                })
                
            })
            .catch((error)=> {
                console.log('request failed : '+error);
            })
        })
});