THREE.NewShaderShader = {

	uniforms:
    {
    },

	vertexShader: [

        "#define PHYSICAL",
		"#define STANDARD",

        "varying vec3 vViewPosition;",
        "#ifndef FLAT_SHADED",
        	"varying vec3 vNormal;",
        	"#ifdef USE_TANGENT",
        		"varying vec3 vTangent;",
        		"varying vec3 vBitangent;",
        	"#endif",
        "#endif",

        "#include <common>",

        "varying vec2 vUv;",

        "#include <displacementmap_pars_vertex>",
        "#include <color_pars_vertex>",
        "#include <fog_pars_vertex>",
        "#include <morphtarget_pars_vertex>",
        "#include <skinning_pars_vertex>",
        "#include <shadowmap_pars_vertex>",
        "#include <logdepthbuf_pars_vertex>",
        "#include <clipping_planes_pars_vertex>",



		"void main() {",

            "vUv = uv;",

            "#include <color_vertex>",
            "#include <beginnormal_vertex>",
            "#include <morphnormal_vertex>",
            "#include <skinbase_vertex>",
            "#include <skinnormal_vertex>",
            "#include <defaultnormal_vertex>",

            "#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED",
	           "vNormal = normalize( transformedNormal );",
            "#ifdef USE_TANGENT",
		       "vTangent = normalize( transformedTangent );",
		       "vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );",
	        "#endif",
            "#endif",

            "#include <begin_vertex>",
            "#include <morphtarget_vertex>",
            "#include <skinning_vertex>",
            "#include <displacementmap_vertex>",
            "#include <project_vertex>",
            "#include <logdepthbuf_vertex>",
            "#include <clipping_planes_vertex>",

            "vViewPosition = - mvPosition.xyz;",

            "#include <worldpos_vertex>",
            "#include <shadowmap_vertex>",
            "#include <fog_vertex>",

		"}"

	].join( "\n" ),

	fragmentShader: [

        "#define PHYSICAL",
        "#define STANDARD",

        "varying vec3 vViewPosition;",

        "#ifndef FLAT_SHADED",
        	"varying vec3 vNormal;",
        	"#ifdef USE_TANGENT",
        		"varying vec3 vTangent;",
        		"varying vec3 vBitangent;",
        	"#endif",
        "#endif",

        "#include <common>",

        "varying vec2 vUv;",

        "#include <packing>",
        "#include <dithering_pars_fragment>",
        "#include <color_pars_fragment>",
        "#include <map_pars_fragment>",
        "#include <alphamap_pars_fragment>",
        "#include <aomap_pars_fragment>",
        "#include <lightmap_pars_fragment>",
        "#include <bsdfs>",
        "#include <cube_uv_reflection_fragment>",
        "#include <envmap_pars_fragment>",
        "#include <envmap_physical_pars_fragment>",
        "#include <fog_pars_fragment>",
        "#include <lights_pars_begin>",
        "#include <lights_physical_pars_fragment>",
        "#include <shadowmap_pars_fragment>",
        "#include <bumpmap_pars_fragment>",
        "#include <normalmap_pars_fragment>",

        "#include <logdepthbuf_pars_fragment>",
        "#include <clipping_planes_pars_fragment>",


		

		"void main() {",
            "vec3 input_emission = vec3(0.0, 0.0, 0.0);",
            "float dot_6 = dot(normalize(vViewPosition), normalize(vNormal));",
            // "float dot_6 = 0.5;",
            `
            vec4 mix_10 = mix(
                vec4(194./256., 198./256., 212./256., 1.0), 
                vec4(220./256., 234./256., 243./256., 1.0), 
                ((sin((dot_6 * 20.0)) + 1.0) / 2.0)
            );
            vec4 mix_11 = mix( 
                vec4(150./256., 152./256., 161./256., 1.0), 
                mix_10, 
                dot_6
            );
            vec4 mix_15 = mix(
                vec4(210./256., 214./256., 223./256., 1.0), 
                mix_11, 
                smoothstep(0.0, 1.0, (dot_6 * 8.0))
            );`,
            "vec3 input_diffuse = mix_15.rgb;",
            "float input_opacity = 1.0;",
            "float input_opacity_clip = 0.0;",


            "#include <clipping_planes_fragment>",
        	"vec4 diffuseColor = vec4( input_diffuse, input_opacity );",

            "gl_FragColor = vec4( diffuseColor.rgb+input_emission, diffuseColor.a );",
            // "gl_FragColor = vec4( vNormal, 1 );",
            // "gl_FragColor = vec4( vViewPosition, 1 );",

        	"#include <tonemapping_fragment>",
        	"#include <encodings_fragment>",
        	"#include <fog_fragment>",
        	"#include <premultiplied_alpha_fragment>",
        	"#include <dithering_fragment>",
		"}"

	].join( "\n" ),


};