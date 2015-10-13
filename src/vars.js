
  // Default parameters for all charts
  var default_vars = {
    // PUBLIC (set by the user)
    container : "",
    this_chart: null,

    new_data: null,
    time_data: null,

    dev : false,
    id : "id",
    id_var : "id",
    var_group: null,
    data: [],
    links: [],
    title: "",

    // Default dimensions
    margin: {top: 0, right: 0, bottom: 0, left: 0},
    rotate: 0,

    // Default Variables mapping
    var_color: null,
    var_sort_asc: false,

    // Interaction
    highlight: [],
    selection: [],
    filter: [],
    zoom: [],

    time: {
      var_time: null,
      current_time: null,
      parse: function(d) { return d; }
    },

    // TABLE
    columns: [],
    sort_by: {'column': 'name', 'asc': true},

    // DOTPLOT
    x_type: "linear",
    x_scale: [],
    x_ticks: 5,
    x_axis: null,
    x_format: function(d) { return d; },
    x_tickSize: 10,
    x_tickPadding: 0,
    x_tickValues: null,
    x_axis_show: false,
    x_axis_orient: "bottom",
    x_grid_show: false,
    x_text: true,
    x_axis_translate: [0, 0],
    x_invert: false,

    // SCATTERPLOT (INCLUDES DOTPLOT)
    y_type: "linear",
    y_scale: [],
    y_ticks: 5,
    y_axis: null,
    y_format: function(d) { return d; },
    y_tickSize: 10,
    y_tickPadding: 0,
    y_tickValues: null,
    y_axis_show: false,
    y_grid_show: false,
    y_text: true,
    y_axis_translate: [0, 0],
    y_invert: false,

    r_scale: null,
    r_cutoff: function(d) { return d > 30; },

    // Automatically generate UI elements
    ui: true,

    lang: 'en_US', // 'es_ES, fr_FR'
    locales: {
        'en_US': {
          'complexity': 'Complexity',
          'low': 'Low',
          'high': 'High',
          'export': 'Export',
          'non-export': 'Non-Export',
          'similarity_link': 'Similarity Link'
        },
        'en_EN': {
          'complexity': 'Complexity',
          'low': 'Low',
          'high': 'High',
          'export': 'Export',
          'non-export': 'Non-Export',
          'similarity_link': 'Similarity Link'
        },
        'es_ES': {
          'complexity': 'Complejidad',
          'low': 'Bajo',
          'high': 'Alto',
          'export': 'Exportación',
          'non-export': 'No-Exportación',
          'similarity_link': 'Enlar de similitud'
        },
        'fr_FR': {
          'complexity': 'Complexité',
          'low': 'Basse',
          'high': 'Haute',
          'export': 'Export',
          'non-export': 'Non-Export',
          'similarity_link': 'Lien de similarité'
        }
    },
    // Graphical properties for graphical marks
    color: d3.scale.category20c(),
    size: d3.scale.linear(),

    dispatch: [],
    evt: {register: function() {}, call: function() {} },

    // SVG Container
    svg: null,
    ratio: 0.5, // Visualization aspect ratio

    duration: 1000,
    interpolate: "monotone",

    layout: {},

    padding: 1,
    treemap_mode: 'squarify',

    treemap: {
      padding: 1,
      d_x: 30,
      d_y: 30,
      depth_text: 1,
      depth_rect: 2
    },

    radius: 5,

    radius_min: 2,
    radius_max: 10,

    mark: {
      height: 10,
      width: 10,
      rotate: 0,
      radius: 5,
      fill: function(d) { return vars.color(vars.accessor_values(d)[vars.var_color]); }
    },

    accessor_values: function(d) { return d; },
    accessor_data: function(d) { return d; },
    accessor_items: function(d) { return d; },

    container: "#viz",

    refresh: true,
    init: true,
    _user_vars: {},

    list: {type: ["sparkline", "dotplot", "barchart", "linechart", "scatterplot", "grid", "stacked", "piechart", "slopegraph", "productspace", "treemap", "geomap", "stackedbar", "ordinal_vertical", "ordinal_horizontal", "matrix", "radial"],
      mark: ['rect', 'circle', 'star', 'shape']
    },

    default_params: {},

    z_index: [
 //     {selector: '.mark__group', attribute: '__aggregated', type: 'productspace', weight: 1},
      {selector: '.connect__group', type: 'productspace', weight: 1, event: 'highlightOut'},
      {selector: '.mark__group', type: 'productspace', weight: 1, event: 'highlightOut'},
      {selector: '.connect__group', attribute: '__highlighted', type: 'productspace', weight: 1, event: 'highlightOn'},
      {selector: '.mark__group', attribute: '__highlighted', type: 'productspace', weight: 1, event: 'highlightOn'},
      {selector: '.mark__group', attribute: '__highlighted__adjacent', type: 'productspace', weight: 1, event: 'highlightOn'},
    ],

    set: []
  };

  vars = vistk.utils.merge(vars, default_vars);
