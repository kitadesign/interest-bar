module.exports = ( function () {
	return function IB ( ns ) {
		var opt       = ns.option;
		var self      = this;
		var socket    = {};
		var $ib       = null;

		var min       = opt.min || 0,
			max       = opt.max || 100,
			msTimer   = opt.msTimer || 100,
			downSpeed = opt.downSpeed || 0.1,
			upSpeed   = opt.upSpeed || 5,
			width     = opt.width || 5,
			color     = opt.color || '#5AA7FC';

		self.init = function ( cb ) {
			self._connectSocket( function () {
				self._createBorder( cb );
			} );
		};

		self.start = function () {
			// イベント設置
			socket.on( ns.url, self._onEvent );

			// Access送信
			socket.emit( 'access', { url: ns.url } );

			setInterval( self._tick, msTimer );
		};

		self._connectSocket = function ( cb ) {
			socket = io.connect( 'http://' + ns.root );
			socket.on( 'connect', cb );
		};

		self._createBorder = function ( cd ) {
			// storage読み込み
			var height = ns.height * self._getPercent() / 100;

			$ib = $( '<div />' );
			$ib.css( {
				'right':            0,
				'bottom':           0,
				'height':           height,
				'width':            width,
				'position':         'fixed',
				'background-color': color,
				'cursor':           'pointer'
			} ).on( 'click', function () {
				ns.location.href = 'http://ib.circumflex.jp/';
			} );
			$ib.appendTo( 'body' );
			cd();
		};

		self._getPercent = function () {
			var percent = ns.storage.getItem( 'percent' ) || min;
			percent = parseFloat( percent );
			return isNaN( percent ) ? 0 : percent;
		};

		self._setPercent = function ( percent ) {
			ns.storage.setItem( 'percent', percent );
		};

		self._onEvent = function () {
			self._upBorder();
		};

		self._tick = function () {
			if ( !$ib ) return;
			self._downBorder();
		};

		self._upBorder = function () {
			var percent = self._getPercent();
			percent += upSpeed;
			if ( percent > max ) percent = max;
			self._setPercent( percent );
			$ib.stop().animate( { height: ns.height * percent / 100 }, msTimer );
		};

		self._downBorder = function () {
			var percent = self._getPercent();
			percent = Math.floor( ( percent - downSpeed ) * 10 ) / 10;
			if ( percent < min ) percent = min;
			self._setPercent( percent );
			$ib.stop().animate( { height: ns.height * percent / 100 }, msTimer );
		};
	};
} )();
