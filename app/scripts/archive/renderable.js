
(function(){
	'use strict';


	//create and destry texture
	//

	//------------------------------------------------------------
	function GraphicsDevice(gl) {
		this.gl_ = gl;
		this.context_ = new GraphicsContext(gl);
	}
	GraphicsDevice.prototype.createTexture2D = function() {
		var binding = this.gl_.createTexture(),
		texture = new Texture2D(this);
		texture.setBinding(binding);
		// The texture is not complete, and therefore not usable until
		// after the parameters have been set
		this.context_.initializeTexture(texture);
		return texture;
	};
	GraphicsDevice.prototype.deleteTexture = function(texture) {
		var binding = texture.getBinding();
		this.gl_.deleteTexture(binding);
		texture.setBinding(null);
	};



	//------------------------------------------------------------
	function GraphicsResource(device) {
		this.device_ = device;
		this.binding_ = null;
	}
	GraphicsResource.prototype.getBinding = function() {
		return this.binding_;
	};
	GraphicsResource.prototype.setBinding = function(binding) {
		this.binding_ = binding;
	};


	//------------------------------------------------------------
	//extneds graphics resource
	function Texture2D(device) {
		GraphicsResource.call(this, device);
	}
	Texture2D.prototype = new GraphicsResource();
	Texture2D.constructor = Texture2D;
	Texture2D.prototype.getType = function() {
		// Corresponds to WebGLRenderingContext.TEXTURE_2D
		return this.device_.gl_.TEXTURE_2D;
	};


	//------------------------
	function GraphicsContext(gl) {
		this.gl_ = gl;
		this.activeTexture_ = 0;
		this.boundTextures_ = new Array(8);
	}
	GraphicsContext.prototype.setTextureAt = function(index, texture) {
		// See if the texture is already bound
		if (this.boundTextures_[index] !== texture) {
			var gl = this.gl_;
			// See if the active texture unit is at the given index
			if (this.activeTexture_ !== index) {
				gl.activeTexture(gl.TEXTURE0 + index);
				this.activeTexture_ = index;
			}
			// Bind the texture
			gl.bindTexture(texture.getType(), texture.getBinding());
			this.boundTextures_[index] = texture;
		}
	};









}());


