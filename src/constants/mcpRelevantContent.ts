export const MCP_RELEVANT_CONTENT = [
  {
    id: -1,
    title: 'Promotions',
    content: '.',
    class: 'relevant_content_dummy',
    tool_name: 'promotions',
    tool: true,
    canBeDeleted: false
  },
  {
    id: -2,
    title: 'Payment',
    content: '.',
    class: 'relevant_content_dummy',
    tool_name: 'payment',
    tool: true,
    canBeDeleted: false
  },
  {
    id: -3,
    title: 'Shipment Policies',
    content: '.',
    class: 'relevant_content_dummy',
    tool_name: 'shipment',
    tool: true,
    canBeDeleted: false
  },
  {
    id: -4,
    title: 'Catalog',
    content: '.',
    class: 'relevant_content_dummy',
    tool_name: 'catalog',
    tool: true,
    canBeDeleted: false
  }
];
export const MCP_TITLES = ['Shipment Policies', 'Payment', 'Promotions', 'Catalog'] as const;
export const MCP_SECTION_LINKS = {
  'Shipment Policies': '/settings/shipping-methods',
  'Payment': '/settings/payments',
  'Promotions': '/promotions',
  'Catalog': '/products',
} as const;