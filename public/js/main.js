$(document).ready(() => {
    // Place JavaScript code here...
  $('#color-wheel').colorpicker({
    color: '#ffffff',
    container: true,
    inline: true
  }).on('changeColor', _.debounce((e) => {
    const color = `s${e.color.toHex()}`;

    $.post('/test', { data: color });
  }, 100));

  $('.btn-ajax').on('click', function (event) {
    event.preventDefault();
    const id = $(this).data('id');
    const slug = $(this).data('slug');
    console.log(id);


    $.post(slug, { id });
  });

  $('.btn-animation').on('click', function (event) {
    event.preventDefault();
    const id = $(this).data('id');
    const slug = $(this).data('slug');


    $.post(slug, { id });
  });
});
