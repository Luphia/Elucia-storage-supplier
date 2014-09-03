/*
 * @Function: 首次啟用 Supplier
 * @Author: mengtsang
 * @Date: 2014/03/14
 */
define(function() {
	var Register = function() {
		var init = function(_node, _data) {
			this.data = _data;

			$('input.account', _node).keyup( function() {
				var account = $(this).val();
				if (account.trim() == "") {
					$(this).parent().children('div.tip').text("");
					$('div.register div.main input.confirm').prop('disabled', true);
					$('div.register div.footer button').prop('disabled', true);
				}
				else
					checkExist(account, this);
			});

			$('input.password', _node).keyup( function() {
				var pwd = $(this).val();
				if (pwd.trim() == "")
					$(this).parent().children('div.tip').text("");
				else {
					var strength = checkPasswordStrength(pwd);

					if (strength == "Strong")
						color = "green";
					else if (strength == "Good")
						color = "blue";
					else if (strength == "Weak")
						color = "darkorange";
					else
						color = "red";
					$(this).parent().children('div.tip').text(strength).css('color',color);
				}
			});

			var myCheckPassword = $.proxy(this, "checkPassword"),
				myRegisterNewMachine = $.proxy(this, "registerNewMachine"),
				myReset = $.proxy(this, "reset");
			$('button#login', _node).click( function() {
				var account = $('input.account', _node).val(),
					password = $('input.password', _node).val();

				if (password.trim() == "") {
					$('div.footer span.message', _node).addClass("alert").text("enter your password");
					$('input.password', _node).focus();
				} else {
					$('div.footer span.message', _node).removeClass("alert").text("checking...");
					var data = {
						account: account,
						password: password,
						afterLogin: _data.afterLogin,
						node: _node
					};
					myCheckPassword(data, myRegisterNewMachine);
				}
			});

			$('button#new', _node).click( function() {
				var account = $('input.account', _node).val(),
					password = $('input.password', _node).val(),
					confirm = $('input.confirm', _node).val();

				if (password.trim() == "") {
					$('div.footer span.message', _node).addClass("alert").text("enter your password");
					$('input.password', _node).focus();
				} else if (confirm.trim() == "") {
					$('div.footer span.message', _node).addClass("alert").text("enter your password again");
					$('input.confirm', _node).focus();
				} else if (account == password) {
					$('div.footer span.message', _node).addClass("alert").text("same account and password");
					$('input.password', _node).focus();
				} else if (password != confirm) {
					$('div.footer span.message', _node).addClass("alert").text("confirm password is not correct");
					$('input.confirm', _node).focus();
				} else {
					$('div.footer span.message', _node).removeClass("alert").text("checking...");
					var widget = {
						name: "register.info",
						data: {
							account: account,
							password: password,
							afterLogin: _data.afterLogin,
							registerNewMachine: myRegisterNewMachine,
							reset: myReset,
							backNode: _node
						}
					};
					elucia.add(widget);
					_node.hide();
				}
			});

			return this;
		},

		checkExist = function( _account, _element ) {
			var data = {
				url: "/checkAccount/" + _account,
				success: function(_response) {
					if (_response.result == 1) {
						if (_response.data.account) {
							$(_element).parent().children('div.tip').text("已使用");
							$('div.register div.main input.confirm').prop('disabled', true);
							$('div.register div.footer button#new').prop('disabled', true);
							$('div.register div.footer button#login').prop('disabled', false);
						}
						else {
							$(_element).parent().children('div.tip').text("可使用");
							$('div.register div.main input.confirm').prop('disabled', false);
							$('div.register div.footer button#new').prop('disabled', false);
							$('div.register div.footer button#login').prop('disabled', true);
						}
					}
				}
			};

			elucia.rest.get(data);
		},

		checkPassword = function( _data, _callback ) {
			var data = {
				url: "/checkPassword/" + _data.account + '/' + _data.password,
				success: function(_response) {
					if (_response.result == 1) {
						if (_response.data.clientId) {
							$('div.footer span.message', data.node).removeClass("alert").text("registering...");
							_callback && _callback( _data, _response.data.clientId );
						} else {
							$('div.footer span.message', data.node).addClass("alert").text(_response.message);
						}
					}
				}
			};
			elucia.rest.get(data);
		},

		checkPasswordStrength = function( _pwd ) {
			var score = 0,
				pass = {
					short: "Too short",
					bad: "Weak",
					good: "Good",
					strong: "Strong"
				};

			//password < 4
			if (_pwd.length < 4) return pass.short;

			score += _pwd.length * 4;
			score += ( checkRepetition(1,_pwd).length - _pwd.length ) * 1;
		 	score += ( checkRepetition(2,_pwd).length - _pwd.length ) * 1;
		 	score += ( checkRepetition(3,_pwd).length - _pwd.length ) * 1;
		 	score += ( checkRepetition(4,_pwd).length - _pwd.length ) * 1;

		 	//password has 3 numbers
		 	if (_pwd.match(/(.*[0-9].*[0-9].*[0-9])/)){ score += 5;} 
		 			    
		 	//password has 2 symbols
		 	if (_pwd.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)){ score += 5 ;}
		 			    
		 	//password has Upper and Lower chars
		 	if (_pwd.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)){  score += 10;} 
		 			    
		 	//password has number and chars
		 	if (_pwd.match(/([a-zA-Z])/) && _pwd.match(/([0-9])/)){  score += 15;} 

		 	//password has number and symbol
		 	if (_pwd.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && _pwd.match(/([0-9])/)){  score += 15;} 
		 			    
		 	//password has char and symbol
		 	if (_pwd.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && _pwd.match(/([a-zA-Z])/)){score += 15;}
		 			    
		 	//password is just a numbers or chars
		 	if (_pwd.match(/^\w+$/) || _pwd.match(/^\d+$/) ){ score -= 10;}
		 	
		 	if (score < 34)
		 		return pass.bad;
		 	else if (score < 68)
		 		return pass.good;
		 	else
		 		return pass.strong;
		},

		checkRepetition = function( _len, _str ) {
			var res = "";
     		for (var i = 0; i<_str.length ; i++ ) {
     		    var repeated = true;
         
     		    for (var j = 0; j < _len && (j+i+_len) < _str.length;j++) {
     		        repeated = repeated && (_str.charAt(j+i)==_str.charAt(j+i+_len));
     		    }
     		    if (j<_len){repeated=false;}
     		    if (repeated) {
     		        i += _len-1;
     		        repeated = false;
     		    }
     		    else {
     		        res += _str.charAt(i);
     		    }
     		}
     		return res;
		},

		registerConfig = function( _data ) {
			var request = {
				url: "/registerConfig",
				data: {
					path: "./config/config.json",
					defaultPath: "./config/config.default.json",
					account: _data.account,
					password: _data.password,
					publicIP: _data.publicIP
				},
				success: function( _response ) {
					if (_response.result) {
						console.log("Register Config Success.");
						remoteLogin( _data );	
					}
					else {
						$('div.footer span.message', _data.node).addClass("alert").text(i18n._(_response.message));
					}
				}
			};
			elucia.rest.post(request);
		},

		registerNewMachine = function( _data, _clientId ) {
			var request = {
				url: "/registerNewMachine",
				data: {
					account: _data.account,
					clientId: _clientId
				},
				success: function( _res ) {
					if ( _res.result == 1) {
						console.log("Register Machine Success.");
						registerConfig( _data );
					}
					else {
						console.log("Register Machine Fail.");
						$('div.footer span.message', _data.node).addClass("alert").text(i18n._(_res.message));
					}
				}
			};
			elucia.rest.post(request);
		},

		remoteLogin = function( _data ) {
			var request = {
				url: "/login",
				data: {
					"username": _data.account,
					"password": _data.password
				},
				success: function( _res ) {
					if (_res.result == 1) {
						destroy( _data.node );
						var user = {
							username: _data.account,
							password: _data.password
						};
						_data.afterLogin(user);
					}
					else
						$('div.footer span.message', _data.node).addClass("alert").text(_res.message);
				}
			};

			elucia.rest.post(request);
		},

		show = function() {
			$("div.register", this.node).animate({"margin-top": "-100"}, 300);
		},
		hide = function() {
			$("div.register", this.node).animate({"margin-top": "-100%"}, 300);
		},
		alert = function(_data) {
			$("div.register span.message", this.node).addClass("alert").text(_data);
			$("div.register", this.node).animate({"margin-left": "-=10"}, 100, function() {
				$("div.register", this.node).animate({"margin-left": "+=20"}, 100, function() {
					$("div.register", this.node).animate({"margin-left": "-=20"}, 100, function() {
						$("div.register", this.node).animate({"margin-left": "+=20"}, 100, function() {
							$("div.register", this.node).animate({"margin-left": "-=20"}, 100, function() {
								$("div.register", this.node).animate({"margin-left": "+=10"}, 100);
							})
						})
					})
				})
			});
		},

		reset = function( _node ) {
			$('input.account', _node).val('');
			$('input.account', _node).parent().children('div.tip').text('');
			$('input.password', _node).val('');
			$('input.password', _node).parent().children('div.tip').text('');
			$('input.confirm', _node).val('');
			$('div.footer', _node).find('button').prop('disabled', true);
		},

		destroy = function( _node ) {
			console.log("### register.app destroy ###");
			_node.remove();
		},

		that = {
			init: init,
			checkPassword: checkPassword,
			hide: hide,
			remoteLogin: remoteLogin,
			registerNewMachine: registerNewMachine,
			reset: reset,
			show: show,
			alert: alert,
			destroy: destroy
		};

		return that;
	};

	return Register;
});