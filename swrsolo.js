
// --- Array additionnal functions ---
Array.prototype.remove = function(elem) {
    var index = this.indexOf(elem);
    this.splice(index, 1);
};

Array.prototype.clone = function() {
    return this.slice(0);
};

Array.prototype.shuffle = function() {
    var j, x, i;
    for (i = this.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = this[i - 1];
        this[i - 1] = this[j];
        this[j] = x;
    }
    return this;
}

// ---- Main app class ------------
var StarWarsRebellionSolo = function(){
    
    var systems = [
        'mon_calamari', 'yavin', 'felucia', 'saleucami',
        'kessel', 'nal_hutta', 'toydaria', 'bothawui', 
        'tatooine', 'rodia', 'ryloth', 'geonosis', 
        'utapau', 'naboo', 'dagobah', 'sullust', 
        'mustafar', 'bespin', 'hoth', 'endor', 
        'dathomir', 'mandalore', 'kashyyyk', 'malastare', 
        'dantooine', 'mygeeto', 'illum', 'ord_mantell', 
        'alderaan', 'cato_nemodia', 'corellia', 'coruscant', 
    ];
    
    var imp_systems = [
        'corellia', 'mandalore', 'mygeeto', 'sullust', 
        'saleucami', 'mustafar', 'rodia'
    ];
    
    var probe_deck = [];
    var probe_hand = [];
    var initial_hand = [];
    var rebel_base = "";
    var basic_game = false;
    
    var systems_white = [];
    var systems_green = [];
    var systems_red = [];
    
    var InitCards = function(){
        probe_deck = systems.clone();
        probe_deck.remove('coruscant');
        probe_deck.shuffle();
    };
    
    var InitBasic = function(){
        DrawCard('mandalore');
        DrawCard('saleucami');
        DrawCard('corellia');
        DrawCard('sullust');
        DrawCard('mustafar');
        basic_game = true;
        initial_hand = probe_hand.clone();
    };
    
    var InitAdvanced = function(){
        
        imp_systems.shuffle();
        imp_systems = imp_systems.slice(0, 5);
        for(var i=0; i<imp_systems.length; i++){
            DrawCard(imp_systems[i]);
        }
        
        basic_game = false;
        initial_hand = probe_hand.clone();
    };
    
    var DrawCard = function(name){
        
        if(probe_deck.length > 0){
            
            var card = "";
            if(name){
                card = name
                probe_deck.remove(card);
            }else{
                card = probe_deck.shift();
            }
            
            probe_hand.push(card);
            probe_hand.sort();
            jQuery('#text_zone').html('New card: ' + card);
        }else{
            jQuery('#text_zone').html('No card left in the deck!');
        }
    };
    
    var RefreshCardList = function(){
        var html = "";
        for(var i=0; i<probe_hand.length; i++){
            html += '<div class="card-line">' + probe_hand[i] + '</div>';
        }
        jQuery('#display_area').html(html);
        jQuery('#hand_count').html(probe_hand.length + "/" + (probe_hand.length + probe_deck.length));
    };

    var GuessBase = function(){
        var selected = jQuery('#guess_select').val();
        jQuery('#guess_select').val("");
        
        if(selected){
            if(selected == rebel_base){
                jQuery('#text_zone').html("Well played! " + selected + " is the rebel base! The force is strong with you.");
            }else{
                jQuery('#text_zone').html(selected + " is not the rebel base!");
            }
        }
    };
    
    var UpdateSystemColors = function(){
        
        systems_white = [];
        systems_green = [];
        systems_red = [];
        
        jQuery.each(jQuery('.map-selector'), function(i, system){
            if(jQuery(system).hasClass('red')){
                systems_red.push(system.id);
            }
            if(jQuery(system).hasClass('white')){
                systems_white.push(system.id);
            }
            if(jQuery(system).hasClass('green')){
                systems_green.push(system.id);
            }
        });
    }
    
    var RelocateBase = function(nb_card){
        
        var nbCard = nb_card || 32;
        old_base = rebel_base;
        
        //Find new rebel base
        var rebel_hand = [];
        for(var i=0; i<nbCard; i++){
            if(probe_deck.length > 0){
                var card = probe_deck.shift();
                rebel_hand.push(card);
            }
        }
        
        //Check at base colors
        UpdateSystemColors();
        
        //Find best card in rebel hand
        var best_card = "";
        var isGreen = false;
        for(var i=0; i<rebel_hand.length; i++){
            var card = rebel_hand[i];
            if(systems_green.indexOf(card) >= 0){
                best_card = card;
                isGreen = true;
            }
            if(!isGreen && systems_white.indexOf(card) >= 0){
                best_card = card;
            }
        }
        
        //Set back in deck
        for(var i=0; i<rebel_hand.length; i++){
            var card = rebel_hand[i];
            if(card !== best_card){
                probe_deck.push(card);
            }
        }
        
        console.log("Cards drawn");
        console.log(rebel_hand);
        console.log("Base selected");
        console.log(best_card);
        
        //Set new rebel base
        if(best_card){
            rebel_base = best_card;
            if(old_base){
                probe_hand.push(old_base); //Push old base in probe_deck or probe_hand ???
                probe_hand.sort();
            }
        }
        
        // Text 
        if(rebel_base !== old_base){
            jQuery('#text_zone').html("A new base has been established for the rebel player!" + ( old_base ? " Previous base: " + old_base : ""));
        }else{
            jQuery('#text_zone').html("The rebel player failed at establishing a new base.");
        }
        
        RefreshCardList();
    };

    var RefreshRelocateBase = function(){
        
        var systems_ctl = [
            {id: 'mon_calamari', top: '9%', left: '15%', size: '5%'},
            {id: 'yavin', top: '38%', left: '10%', size: '5%'},
            {id: 'felucia', top: '28%', left: '18%', size: '5%'},
            {id: 'saleucami', top: '27%', left: '27%', size: '5%'},
            
            {id: 'kessel', top: '13%', left: '32%', size: '5%'},
            {id: 'nal_hutta', top: '11%', left: '42%', size: '5%'},
            {id: 'toydaria', top: '27%', left: '38%', size: '5%'},
            {id: 'bothawui', top: '20%', left: '50%', size: '5%'},
            
            {id: 'tatooine', top: '5%', left: '66%', size: '5%'},
            {id: 'rodia', top: '24%', left: '62%', size: '5%'},
            {id: 'ryloth', top: '5%', left: '82%', size: '5%'},
            {id: 'geonosis', top: '14%', left: '75%', size: '5%'},
            
            {id: 'utapau', top: '27%', left: '88%', size: '5%'},
            {id: 'naboo', top: '39%', left: '68%', size: '5%'},
            {id: 'dagobah', top: '51%', left: '78%', size: '5%'},
            {id: 'sullust', top: '63%', left: '71%', size: '5%'},
            
            {id: 'mustafar', top: '52%', left: '89%', size: '5%'},
            {id: 'bespin', top: '72%', left: '83%', size: '5%'},
            {id: 'hoth', top: '71%', left: '93%', size: '5%'},
            {id: 'endor', top: '87%', left: '85%', size: '5%'},
            
            {id: 'dathomir', top: '56%', left: '22%', size: '5%'},
            {id: 'mandalore', top: '53%', left: '31%', size: '5%'},
            {id: 'kashyyyk', top: '50%', left: '40%', size: '5%'},
            {id: 'malastare', top: '48%', left: '55%', size: '5%'},
            
            {id: 'dantooine', top: '65%', left: '4%', size: '5%'},
            {id: 'mygeeto', top: '76%', left: '12%', size: '5%'},
            {id: 'illum', top: '88%', left: '19%', size: '5%'},
            {id: 'ord_mantell', top: '81%', left: '27%', size: '5%'},
            
            {id: 'alderaan', top: '74%', left: '38%', size: '5%'},
            {id: 'cato_nemodia', top: '66%', left: '58%', size: '5%'},
            {id: 'corellia', top: '83%', left: '65%', size: '5%'},
        ];
        
        var html = '<span id="coruscant" class="map-selector-static red" style="top:89%;left:50%;width:5%;height:5%;"></span>';
        for(var i=0; i<systems_ctl.length; i++){
            var sys = systems_ctl[i];
            html += '<span id="' + sys.id + '" class="map-selector white"'
                + ' style="top:' + sys.top + ';left:' + sys.left + ';width:' + sys.size + ';height:' + sys.size + ';"></span>';
        }
        
        jQuery('#map_controls').html(html);
        
        //Initial red
        for(var i=0; i<initial_hand.length; i++){
            jQuery('#' + initial_hand[i]).removeClass('white').addClass('red');
        }
        
        jQuery('.map-selector').click(function(){
            var self = jQuery(this);
            if(self.hasClass('white')){
                self.removeClass('white');
                self.addClass('green');
            }
            else if(self.hasClass('green')){
                self.removeClass('green');
                self.addClass('red');
            }
            else if(self.hasClass('red')){
                self.removeClass('red');
                self.addClass('white');
            }
        });
    };
    
    var ShowCards = function(){
        jQuery('#card_zone').show();
        jQuery('#map_zone').hide();
        jQuery('#action_zone').show();
        jQuery('#map_buttons').hide();
        jQuery('#text_zone_top').hide();
        if(!rebel_base){
            jQuery('#text_zone').html("WARNING! There is currently no rebel base. Please click on relocate base to select a new base for the rebels.");
        }
    };
    
    var ShowMap = function(){
        jQuery('#card_zone').hide();
        jQuery('#map_zone').show();
    };

    var StartGame = function(){
        
        RefreshRelocateBase(true);
        RefreshCardList();
        
        jQuery('#start_zone').hide();
        
        //Init guess select
        var guess_systems = systems.clone();
        guess_systems.sort();
        jQuery('#guess_select').append(jQuery('<option>', { value: '', text : '' }));
        jQuery.each(guess_systems, function (i, system) {
            jQuery('#guess_select').append(jQuery('<option>', { 
                value: system,
                text : system 
            }));
        });
        
        //Text
        jQuery('#action_zone').hide();
        jQuery('#map_buttons').show();
        jQuery('#text_zone_top').show();
        jQuery('#text_zone_top').html("Waiting for rebel base selection...");
        
        //Text
        var html = "<div>Imperial player starting cards: </div><ul>";
        for(var i=0; i<initial_hand.length; i++){
            html += "<li>" + initial_hand[i] + "</li>";
        }
        html += "</ul>";
        jQuery('#text_zone').html(html);
    };
    
    // ---- Special cards --------
    
    function InterrogationDroid(){
        
        var planets = [];
        previousPick = rebel_base;
        planets.push(rebel_base);
        
        //Check at base colors
        UpdateSystemColors();
        
        //Add 2 greens
        if(systems_green.length > 0){
            for(var i=0; i<4; i++){
                var pick = systems_green[Math.floor(Math.random()*systems_green.length)];
                if(planets.indexOf(pick) == -1){
                    planets.push(pick);
                }
            }
        }
        
        //Add 2 whites
        if(systems_white.length > 0){
            for(var i=0; i<4; i++){
                var pick = systems_white[Math.floor(Math.random()*systems_white.length)];
                if(planets.indexOf(pick) == -1){
                    planets.push(pick);
                }
            }
        }
        
        //Add 2 reds
        if(systems_red.length > 0){
            for(var i=0; i<4; i++){
                var pick = systems_red[Math.floor(Math.random()*systems_red.length)];
                if(planets.indexOf(pick) == -1){
                    planets.push(pick);
                }
            }
        }
        
        //Get 3 first and shuffle
        planets = planets.slice(0, 3);
        planets.shuffle();
        
        var planets_str = planets.toString().replace(/\,/g, ', ');
        jQuery('#text_zone').html("Interrogation Droid: " + planets_str);
    }
    
    function InterceptTransmission(){
        var hand = [];
        var new_cards = [];
        
        UpdateSystemColors();
        
        for(var i=0; i<8; i++){
            var card = probe_deck.shift();
            if(card){
                hand.push(card);
            }
        }
        
        for(var i=0; i<hand.length; i++){
            var card = hand[i];
            
            if(systems_red.indexOf(card) >= 0){
                probe_hand.push(card);
                new_cards.push(card);
            }
            else{
                probe_deck.push(card);
            }
            
        }
        
        probe_hand.sort();
        probe_deck.shuffle();
        RefreshCardList();
        ShowCards();
        
        var planets_str = new_cards.toString().replace(/\,/g, ', ');
        jQuery('#text_zone').html("Intercept Transmission: new cards (" + new_cards.length + "/" + hand.length +"): " + planets_str);
        if(new_cards.length == 0){
            jQuery('#text_zone').html("Intercept Transmission: No imperial card drawn! Sorry!");
        }
    }
    
    function HomingBeacon(){
        for(var i=0; i<systems.length; i+=4){
            var tempList = systems.slice(i, i+4);
            if(tempList.indexOf(rebel_base) >= 0){
                var planets_str = tempList.toString().replace(/\,/g, ', ');
                jQuery('#text_zone').html("Homing Beacon: selected region: " + planets_str);
            }
        }
    }

    // ------ Left menu UI -----
    jQuery('#start_btn').click(function(){
        InitCards();
        InitBasic();
        StartGame(); 
        ShowMap();
    });
    
    jQuery('#start_advanced_btn').click(function(){
        InitCards();
        InitAdvanced();
        StartGame(); 
        ShowMap();
    });
    
    jQuery('#new_game').click(function(){
        var confirmed = confirm("Start a new game?");
        if(confirmed){
            window.location.reload();
        }
    });
    
    jQuery('#draw_btn').click(function(){
        DrawCard();
        RefreshCardList();
        
        jQuery('#draw_btn').hide();
        setTimeout(function(){
            jQuery('#draw_btn').show();
        }, 1000);
    });
    
    jQuery('#guess_btn').click(function(){
        GuessBase();
    });
    
    jQuery('#relocate_btn').click(function(){
        ShowMap();
        jQuery('#action_zone').hide();
        jQuery('#map_buttons').show();
        jQuery('#text_zone_top').show();
        jQuery('#text_zone_top').html("Waiting for rebel base selection...");
        jQuery('#text_zone').html("");
    });
    
    jQuery('.tab').click(function(){
        jQuery('.action-option').hide();
        jQuery('.tab').removeClass('selected');
        jQuery(this).addClass('selected');
        jQuery('#action_' + this.id).show();
    });
    
    jQuery('#view_cards').click(function(){
       ShowCards(); 
    });
    
    jQuery('#view_map').click(function(){
       ShowMap(); 
    });
    
    jQuery('#the_map_link').click(function(){
       ShowMap(); 
    });
    
    //Special cards
    jQuery('#interrogation_btn').click(function(){
        InterrogationDroid();
    });
    
    jQuery('#intercept_btn').click(function(){
        InterceptTransmission(); 
    });
    
    jQuery('#homing_btn').click(function(){
        HomingBeacon(); 
    });
    
    
    // --------- Right section UI ---------
    
    jQuery('#map_btn_all').click(function(){ 
        RelocateBase();
        ShowCards();
        probe_deck.shuffle();
    });
    
    jQuery('#map_btn_4').click(function(){ 
        RelocateBase(4);
        ShowCards();
    });
    
    jQuery('#map_btn_8').click(function(){ 
        RelocateBase(8);
        ShowCards();
    });
    
    jQuery('#map_btn_cancel').click(function(){
        ShowCards();
    });
    
};

window.addEventListener("load", function(){
   var swr = new StarWarsRebellionSolo();
});
