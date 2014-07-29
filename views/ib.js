module.exports = ( function () {
	return function IB ( ns ) {
		var opt       = ns.option;
		var self      = this;
		var socket    = {};
		var $ib       = null;
		var currentPercent = 0;

		var min       = opt.min || 0,
			max       = opt.max || 100,
			msTimer   = opt.msTimer || 100,
			downSpeed = opt.downSpeed || 1,
			upSpeed   = opt.upSpeed || 5,
			width     = opt.width || 5,
			color     = opt.color || '#5AA7FC',
			url       = opt.url || ns.url;

		self.init = function ( cb ) {
			self._connectSocket( function () {
				self._createBorder( cb );
			} );
		};

		self.start = function () {
			// イベント設置
			socket.on( url, self._onEvent );
			if ( ns.url !== url ) socket.on( ns.url, self._onEvent );

			// Access送信
			socket.emit( 'access', { url: url } );

			// storage読み込み

			currentPercent = ns.storage.getItem( 'percent' ) || min;
			currentPercent = parseFloat( currentPercent );
			if ( isNaN( currentPercent ) ) currentPercent = min;
			if ( currentPercent > min ) self._upBorder( currentPercent );
		};

		self._connectSocket = function ( cb ) {
			socket = io.connect( 'http://' + ns.root );
			socket.on( 'connect', cb );
		};

		self._createBorder = function ( cd ) {
			$ib = $( '<div />' );
			$ib.css( {
				'right':            0,
				'bottom':           0,
				'height':           min,
				'width':            width,
				'background-color': color,
				'position':         'fixed',
				'cursor':           'pointer'
			} ).on( 'click', function () {
				ns.window.open( 'http://' + ns.root, null );
			} );
			$ib.appendTo( 'body' );
			cd();
		};

		self._setPercent = function ( percent ) {
			currentPercent = percent;
			ns.storage.setItem( 'percent', percent );
		};

		self._onEvent = function () {
			var percent = upSpeed + currentPercent;
			if ( percent > max ) percent = max;
			self._upBorder( percent );

		};

		self._upBorder = function ( percent ) {
			var height = ns.height * percent / max;
			var oldH = $ib.height();
			$ib.stop().animate( {
				height: height
			}, {
				duration: msTimer,
				progress: function ( animation, progress, remainingMs ) {
					self._setPercent( ( ( ( height - oldH ) * progress ) + oldH ) / ns.height * max );
				},
				always: function () {
					self._downBorder();
				}
			} );
		};

		self._downBorder = function () {
			var height = ns.height * currentPercent / max;
			$ib.stop().animate( {
				height: min
			}, {
				duration: height / downSpeed * max,
				progress: function ( animation, progress, remainingMs ) {
					self._setPercent( ( height - ( height * progress ) ) / ns.height * max );
				},
				always: function () {
					self._setPercent( min );
				}
			} );
		};
	};
} )();
