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

                    count += 1;
                }
                return data;
            }).then((data) => {
                var prefix ="#example";
                var prefix1 = "#button";
                var prefix2 = "#remove"
                for(var n = 0; n < data.terms.length; ++n) {
                    // Must Strictly use const, otherwise wont work
                    const num = data.terms[n].id;
                    $(prefix1+num).click(() => {
                        window.location.href = '/term'+num;
                    })
                    $(prefix2+num).click(() => {

                        window.location.href = '/term'+num;
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
                    
                }
            }).then(() => {
                var button = document.createElement('div');
                button.setAttribute('class', 'ui fluid button teal');
                button.setAttribute('id', 'button');
                var buttonLabel = document.createElement('label');
                buttonLabel.innerHTML = 'Add New term';
                button.appendChild(buttonLabel);


                $('#list').append(button);
                $('#button').click(() => {
                    window.location.href = '/add/term';
                })
            })
            .catch((error)=> {
                console.log('request failed : '+error);
            })
        })
});