define([ 'jquery', 'underscore', 'backbone', 'text!templates/tabsTpl.html' ],
		function($, _, Backbone, tabTemplate) {
			var TabsView = Backbone.View.extend({
				template : _.template(tabTemplate),
				events : {
					"click .tab" : "tabSelected"
				},

				initialize : function() {
					_.extend(this, Backbone.Events);
					this.activeTab = "";
					this.messageTarget = this.options.config.messageTabId;
					this.defaultActiveTab = this.options.config.defaultActiveTab ? this.options.config.defaultActiveTab : 0;
					this.parentContainer = this.options.config.parentContainer ? this.options.config.parentContainer : $("body");
					this.render();
				},
				
				render : function() {
					$(this.el).html(this.template({
						config : this.options.config
					}));
					
					this.selectTab(this.defaultActiveTab);
					return this;
				},
				
				tabSelected : function(event) {
					var selectedTab = $(event.currentTarget);
					this.highlightTab(selectedTab);
				},
				
				hideAll : function() {
					var _this = this;
					$(this.el).find(".tab").each(function(index, elem) {
						var tab = $(elem);
						tab.removeClass('select');
						_this.parentContainer.find("#" + tab.attr('data-target')).hide();
					});
					this.hideMessageTab();
				},
				
				/* 
				 * Hide All tabs without de-selecting currently active tab 
				 * Used for showing action grid success message
				 * */
				hideAllTabBody : function() {
					var _this = this;
					$(this.el).find(".tab").each(function(index, elem) {
						_this.parentContainer.find("#" + $(elem).attr('data-target')).hide();
					});
				},
				
				selectTab : function(index, fireEvent) {
					var tab = $($(this.el).find(".tab").get(index));
					this.highlightTab(tab, fireEvent);
				},
				
				hideTab : function(index) {
					var tab = $($(this.el).find(".tab").get(index));
					tab.css("display", "none");
				},
				
				showTab : function(index) {
					var tab = $($(this.el).find(".tab").get(index));
					tab.css("display", this.options.config.tabType == "icons" ? "inline-block" : "inline");
				},
				
				highlightTab : function(tabEl, fireEvent){
					this.hideAll();
					tabEl.addClass('select');
					this.parentContainer.find("#" + tabEl.attr('data-target')).show();
					this.activeTab = tabEl.attr('data-target');
					
					if(fireEvent != false){
						this.trigger("tabSelected", tabEl.attr('data-target'));
					}
				},
				
				getActiveTab: function(){
					return this.activeTab;
				},
				
				getActiveTabIndex: function(){
					return this.getTabIndex(this.activeTab);
				},
				
				//Specific to notification batch with count of new activities 
				setBatchCount: function(tabIndex, count){
					var tab = $($(this.el).find(".tab").get(tabIndex));
					var batch = tab.find(".count");
					if(batch.length == 0){
						tab.prepend("<div class='count'>"+count+"</div>");
					} else {
						batch.html(count);
					}
					
					if(count == 0){
						tab.find(".count").hide();
					} else {
						tab.find(".count").show();
					}
				},
				
				showMessageTab : function (msg){
					this.hideAllTabBody();
					this.activeTab = -1;
					this.parentContainer.find("#" + this.messageTarget).show();
					this.parentContainer.find("#" + this.messageTarget + " .message").html(msg + " <br/> &nbsp;");
				},
				
				hideMessageTab : function (){
					this.parentContainer.find("#" + this.messageTarget).hide();
				},
				
				getTabIndex : function(target) {
					var tabIndex = -1;
					$(this.el).find(".tab").each(function(index, tab) {
						if($(tab).attr('data-target') == target ){
							tabIndex = index;
						};
					});
					return tabIndex;
				},
			});
			return TabsView;
		});
