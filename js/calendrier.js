(function ($) { 
  $(document).ready(function(){ 
    $('#calendrier_search_button').click(function(){
      getcalendrier();
    });
    $('table.recherche_avancee').hide();
    $('legend.recherche_avancee').click(function(){
      $('table.recherche_avancee').toggle();
      if($('table.recherche_avancee').is(':visible')){
        $('legende.recherche_avance').removeClass('closed');
        $('legende.recherche_avance').addClass('open');
      } else {
        $('legende.recherche_avance').removeClass('open');
        $('legende.recherche_avance').addClass('closed');
      }
    });
    getcalendrier();
  });

  function getcalendrier(){
    $.ajax({
      type:"POST",
      async:false,
      url: "./ajax/calendrier",
      data: { pattern: $('#calendrier_search').val() },
      dataType: 'text',
      success: refreshcalendrier,
      error: alertError
    });
  };

  function refreshcalendrier(options){
    $('#calendrier').fullCalendar('destroy');
    $('#calendrier').fullCalendar($.parseJSON(options));
  };

  function alertError(xhr, ajaxOptions, thrownError){
    $('#calendrier').html("Request failed: " + xhr.status+" "+thrownError);
  };

})(jQuery);