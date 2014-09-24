(function ($) { 
  const CATALOFORMA_PAGER_NBR = 25;
  $(document).ready(function(){ 
    $('table.recherche_avancee').hide();
    if($('#messageMail').length) {//Formulaire d'envoi de rappels
      $('#clearAttachment').hide();
      $('#attachmentMail').change(function(){
        $('#clearAttachment').show();
      });
      $('#mail_inscrits').click(function(){  
        var dataString = $('#publipostageForm').serialize();
        var myForm = $('#publipostageForm');
        $.ajax({
          type:"POST",
          async:false,
          url: "../ajax/inscrits/mail",
          data: new FormData(document.forms.namedItem("publipostageForm")),
          //dataType: 'text',
          processData: false,
          contentType: false,
          success: messageMail,
          error: alertError
        });
      });
      $('#view_formation').click(function(){  
        window.location = "../formation/view/"+$('#id_formation').val(); 
      });
      $('#clearAttachment').click(function(){
        $('#attachmentMail').wrap('<form>').parent('form').trigger('reset');
        $('#attachmentMail').unwrap();
        $('#clearAttachment').hide();
      });
    }
    else if($('#pdf').length){//Formulaire d'édition de formation
      $('#pdf').change(function(){
        $('#clearPdf').show();
      });
      $('#clearPdf').click(function(){
        $('#pdf').wrap('<form>').parent('form').trigger('reset');
        $('#pdf').unwrap();
        $('#clearPdf').hide();
      });
       $('#new_intervenant').autocomplete({
        serviceUrl: "../../ajax/user/search",
        dataType: 'json',
        minChars: 4,
        onSelect: function(suggestion){ $('#new_intervenant').val(suggestion.data); }
      });
      $('#add_intervenant').click(function(){
        $.ajax({
          type:"POST",
          async:false,
          url: "../../ajax/user/name",
          data: "new_intervenant="+$('#new_intervenant').val(),
          dataType: 'json',
          success: addIntervenant,
          error: alertError
        });
      });
      $('div.remIntervenant').click(function(){
          remIntervenant($(this).parent().attr('id'));
      });
      $('#upd_formation').click(function(){
        $.ajax({
          type:"POST",
          async:false,
          url: "../ajax/formation/upd",
          data: new FormData(document.forms.namedItem("formationForm")),
          //dataType: 'text',
          processData: false,
          contentType: false,
          success: messageFormation,
          error: alertError
        });
      });
      $('#view_formation').click(function(){
        if($('#id_formation').val() > 0){
          window.location = "../formation/view/"+$('#id_formation').val(); 
        } else if ($('#id_clone').val() > 0) {
          window.location = "../formation/view/"+$('#id_clone').val(); 
        } else {
          window.location = "../formations";
        } 
      });
    }
    else if($('#liste_inscrits').length) {//Formulaire de gestion des inscrits d'une formation
      initInscrits();
      $('#new_inscrit').autocomplete({
        serviceUrl: "../../ajax/user/search",
        dataType: 'json',
        minChars: 4,
        onSelect: function(suggestion){ $('#new_inscrit').val(suggestion.data); }
      });

      $('#upd_inscrits').click(function(){
        $.msgbox({
          type : 'confirm',
          content : 'Voulez-vous mettre à jour les présences de cette formation',
          title : 'Mise à jour des présences',
          onClose: function(){
            if(this.val()) updInscrits();
          }
        });
      });

      $('#add_inscrit').click(function(){
        var dataString = $('#inscritsForm').serialize();
        $.ajax({
          type:"POST",
          async:false,
          url: "../../ajax/inscrit/add",
          data: dataString,
          dataType: 'text',
          success: function(message){ messageInscrits(message); getInscrits(); },
          error: alertError
        });
      });

      $('#del_inscrits').click(function(){
        var dataString = $('#inscritsForm').serialize();
        $.ajax({
          type:"POST",
          async:false,
          url: "../../ajax/inscrits/del",
          data: dataString,
          dataType: 'text',
          success: function(message){ messageInscrits(message); getInscrits(); },
          error: alertError
        });
      });

      $('#mail_inscrits').click(function(){ 
        $('#inscritsForm').attr('action', '../../formation/publipostage');
        $('#inscritsForm').submit();
      });

      $('#csv_inscrits').click(function(){
        window.location = "../../ajax/inscrits/csv?id_formation="+$('#id_formation').val();
      });

      $('#csv_presences').click(function(){
        window.location = "../../ajax/presences/csv?id_formation="+$('#id_formation').val();
      });

      $('#edit_formation').click(function(){
        window.location = "../formation/edit/"+$('#id_formation').val();
      });

      $('#clone_formation').click(function(){
        window.location = "../formation/edit/"+$('#id_formation').val()+"?clone=true";
      });

      $('#del_formation').click(function(){
        $.msgbox({
          type : 'confirm',
          content : 'Voulez-vous supprimer définitivement cette formation',
          title : 'Suppression de formation',
          onClose: function(){
            if(this.val()) delFormation();
          }
        });
      });

    }
    else if ($('#formationsForm').length() > 0) { // formulaire de recherche de formations
      $('#new_inscrit').autocomplete({
        serviceUrl: "../../ajax/user/search",
        dataType: 'json',
        minChars: 4,
        onSelect: function(suggestion){ $('#new_inscrit').val(suggestion.data); }
      });

      $('#add_inscrit').click(function(){
        var dataString = $('#formationsForm').serialize();
        $.ajax({
          type:"POST",
          async:false,
          url: "../../ajax/inscrit/add",
          data: dataString,
          dataType: 'text',
          success: function(message){ messageFormations(message); },
          error: alertError
        });
      });

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

      initFormations();

      $('#formations_search_button').click(function(){
        $('#pager_formations').val('0');
        getFormations();
      });

      $('#formations_advsearch_button').click(function(){
        $('#pager_formations').val('0');
        getFormations();
      });

      $('.formations_bycode').click(function(){
        $('#code').val($(this).html());
        $('code_op').val('E');
        $('#pager_formations').val('0');
        getFormations();
      });

      $('#pub_formations').click(function(){
        var dataString = $('#formationsForm').serialize();
        $.ajax({
          type:"POST",
          async:false,
          url: "./ajax/formations/publish",
          data: dataString,
          dataType: 'text',
          success: refreshFormations,
          error: alertError
        });
      });

      $('#unpub_formations').click(function(){
        var dataString = $('#formationsForm').serialize();
        $.ajax({
          type:"POST",
          async:false,
          url: "./ajax/formations/unpublish",
          data: dataString,
          dataType: 'text',
          success: refreshFormations,
          error: alertError
        });
      });

      $('#add_formation').click(function(){
        window.location = ".formation/edit/0";
      });

      $('#formations_clrsearch_button').click(function(){
        $('#date_debut').val('');
        $('#date_fin').val('');
        $('#intitule_op').val('E');
        $('#intitule').val('');
        $('#code_op').val('E');
        $('#code').val('');
        $('#intervenants_op').val('C');
        $('#intervenants').val('');
        $('#status').val('*');
        $('#id_type').val('*');
        $('#pager_formations').val('0');
        getFormations();
      });

    }

    
  });

  function initInscrits(){
    $('#inscritsForm').removeAttr('action');
    $('#inscrits_col_date').click(function(){
      getInscrits('date_inscription');
    }).addClass('thSortable');
    $('#inscrits_col_login').click(function(){
      getInscrits('name');
    }).addClass('thSortable');
    $('#inscrits_col_nom').click(function(){
      getInscrits('nom');
    }).addClass('thSortable');
    $('#inscrits_col_prenom').click(function(){
      getInscrits('prenom');
    }).addClass('thSortable');    
  }

  function updInscrits(){
    var dataString = $('#inscritsForm').serialize();
    $.ajax({
      type:"POST",
      async:false,
      url: "../../ajax/inscrits/upd",
      data: dataString,
      dataType: 'text',
      success: messageInscrits,
      error: alertError
    });
  }

  function getInscrits(colonne){
    var sortBy = $.parseJSON($('#sort_inscrits').val());
    if(colonne.length){
      if(sortBy.col == colonne){
        if(sortBy.by == "ASC") {
          sortBy.by = "DESC";
        } else {
          sortBy.by = "ASC";
        }
      } else {
        sortBy.col = colonne;
        sortBy.by  = "ASC";
      }
    }  
    $('#sort_inscrits').val(JSON.stringify(sortBy));
    
    var dataString = $('#inscritsForm').serialize();

    $.ajax({
      type:"POST",
      async:false,
      url: "../../ajax/inscrits",
      data: dataString,
      dataType: 'text',
      success: refreshInscrits,
      error: alertError
    });
  };

  function refreshInscrits(options){
    $('#inscritsListe').html(options);
    initInscrits();
  };

  function addIntervenant(intervenant){
    var uname = intervenant.uname;
    var id    = "";
    var tmp   = "";
    if(uname.length > 0){//utilisateur drupal ou ldap
      if($('#intervenants_names').val().search(uname) == -1){//utilisateur pas encore intervenant
        tmp = $('#intervenants_names').val().concat(uname,",");
        $('#intervenants_names').val(tmp);
        tmp = $('#intervenants').val().concat(intervenant.cn,",");
        $('#intervenants').val(tmp);
        id = intervenant.cn+","+intervenant.uname;
      }
    } else { //utilisateur non reconnu
      uname = intervenant.cn; 
      tmp = $('#intervenants').val().concat(intervenant.cn,",");
      $('#intervenants').val(tmp);
      id = intervenant.cn; 
    }  
    $('#liste_intervenants').append('<li id="'+id.replace("'","$")+'">'+intervenant.cn.replace('_',' ') +'<div class="remIntervenant"></div></li>');
    $('div.remIntervenant').click(function(){
          remIntervenant($(this).parent().attr('id'));
    });
  }

  function remIntervenant(intervenant){
    var inter = intervenant.split(",");
    var tmp;

    tmp = $('#intervenants_names').val().replace(','+inter[1]+',' , ',');

    $('#intervenants_names').val(tmp);
    
    inter[0] = inter[0].replace(/'/g,"$");
    tmp = $('#intervenants').val().replace(/'/g,"$");

    tmp = tmp.replace(','+inter[0]+',' , ',');
    $('#intervenants').val(tmp.replace("$","'"));

    $('li').filter('[id="'+intervenant.replace(/'/g,"$")+'"]').remove();
  }

  function initFormations(){
    $('#formations_col_date').click(function(){
      getFormations('date_debut',$('#pager_formations').val());
    }).addClass('thSortable');
    $('#formations_col_code').click(function(){
      getFormations('code',$('#pager_formations').val());
    }).addClass('thSortable');
    $('#formations_col_intitule').click(function(){
      getFormations('intitule',$('#pager_formations').val());
    }).addClass('thSortable');

    $('span.pager_formations').click(function(){
      var x;
      getFormations(x, $(this).attr('pager'));
    });
  }

  function getFormations(colonne, pager){
    var sortBy = $.parseJSON($('#sort_formations').val());
    if(typeof colonne != "undefined"){
      if(sortBy.col == colonne){
        if(sortBy.by == "ASC") {
          sortBy.by = "DESC";
        } else {
          sortBy.by = "ASC";
        }
      } else {
        sortBy.col = colonne;
        sortBy.by  = "ASC";
      }
    }  
    $('#sort_formations').val(JSON.stringify(sortBy));
    $('#pager_formations').val(pager);
    var dataString = $('#formationsForm').serialize();

    $.ajax({
      type:"POST",
      async:false,
      url: "./ajax/formations",
      data: dataString,
      dataType: 'text',
      success: refreshFormations,
      error: alertError
    });
  };

  function delFormation(){
    var dataString = $('#formationForm').serialize();
    $.ajax({
      type:"POST",
      async:false,
      url: "../../ajax/inscrits/upd",
      data: dataString,
      dataType: 'text',
      success: messageInscrits,
      error: alertError
    });
  }

  function refreshFormations(options){
    $('#formations').html(options);
    initFormations();
  };


  function messageFormations(message){
    $('#messageFormations').html(message);
  }

  function messageFormation(message){
    $('#messageFormation').html(message);
  }

  function messageMail(message){
    $('#messageMail').html(message);
  }

  function messageInscrits(message){
    //if(message.length > 0){
      $('#messageInscrit').html(message);
    //}
  }

  function alertError(xhr, ajaxOptions, thrownError){
    $('div.message').html("Request failed: " + xhr.status+" "+thrownError);
  };
})(jQuery);