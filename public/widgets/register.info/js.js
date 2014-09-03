/*
 * @Function: 填寫註冊 Supplier 資訊
 * @Author: mengtsang
 * @Date: 2014/03/14
 */
define(function() {
	var Application = function() {
		var init = function(_node, _data) {
			this.data = _data;

			var myRegisterNewAccount = $.proxy(this, "registerNewAccount");
			$('button', _node).click( function() {
				var name = $('input.name', _node).val(),
					contact = $('input.contact', _node).val(),
					email = $('input.email', _node).val(),
					extIp = $('input.ext_ip', _node).val();

				if (name.trim() == "") {
					$('div.footer span.message', _node).addClass("alert").text(i18n._("enter your name"));
					$('input.name', _node).focus();
				} else if (contact.trim() == "") {
					$('div.footer span.message', _node).addClass("alert").text(i18n._("enter your contact"));
					$('input.contact', _node).focus();
				} else if (email.trim() == "") {
					$('div.footer span.message', _node).addClass("alert").text(i18n._("enter your email"));
					$('input.email', _node).focus();
				} else {
					$('div.footer span.message', _node).removeClass("alert").text(i18n._("checking..."));
					var data = {
						account: _data.account,
						password: _data.password,
						machineName: name,
						contact: {
							contact: contact,
							email: email
						},
						publicIP: extIp,
						afterLogin: _data.afterLogin,
						node: _node,
						backNode: _data.backNode,
						reset: _data.reset
					};
					myRegisterNewAccount(data, _node, _data.registerNewMachine);
				}
			});

			return this;
		},

		registerNewAccount = function( _data, _node, _callback ) {
			var request = {
				url: "/registerNewAccount",
				data: {
					account: _data.account,
					password: _data.password,
					machineNumber: "machineNumber",
					machineIp: "machineNumber",
					machineName: _data.machineName,
					contact: _data.contact
				},
				success: function( _res ) {
					if ( _res.result == 1 && _res.message == "register success" ) {
						console.log("Register Account Success.");
						_callback && _callback( _data, _res.data.clientId );
					}
					else {
						console.log("Register Account Fail.");
						destroy(_node);
						$('div.footer span.message', _data.backNode).addClass("alert").text(i18n._(_res.message));
						_data.reset( _data.backNode ); // 清空前頁已填資訊
						_data.backNode.show(); // 跳轉回前頁
					}
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

		destroy = function( _node ) {
			console.log("### register.info destroy ###");
			_node.remove();
		},

		that = {
			init: init,
			hide: hide,
			registerNewAccount: registerNewAccount,
			show: show,
			alert: alert,
			destroy: destroy
		};

		return that;
	};

	return Application;
});