module.exports = {
  aclRules: [{
      roles: 'admin',
      allows: [{
        resources: ['users', 'roles'],
        permissions: '*'
      }]
    },
    {
      roles: 'scientist',
      allows: [{
        resources: ['breeding_pool', 'field_plot', 'genotype',
          'individual', 'marker_data', 'measurement',
          'nuc_acid_library_result', 'sample',
          'sequencing_experiment', 'transcript_count'
        ],
        permissions: ['create', 'update', 'delete']
      }]
    },
    {
      roles: 'guest',
      allows: [{
        resources: ['breeding_pool', 'field_plot', 'genotype',
          'individual', 'marker_data', 'measurement',
          'nuc_acid_library_result', 'sample',
          'sequencing_experiment', 'transcript_count'
        ],
        permissions: 'read'
      }]
    }
  ]
}
