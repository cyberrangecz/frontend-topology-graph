export const simpleTopology = {
  topology: {
    nodes: [
      {
        id: 1,
        name: 'router',
        physical_role: 'router',
        router: true,
      },
      {
        id: 2,
        name: 'pc',
        physical_role: 'desktop',
        router: false,
      }
    ],
    links: [
      {
        id: 5,
        source_interface_id: 3,
        target_interface_id: 4,
        between_routers: false,
      },
      {
        id: 6,
        source_interface_id: 4,
        target_interface_id: 3,
        between_routers: false,
      }
    ],
    interfaces: [
      {
        id: 4,
        node_id: 2,
        ipv4_address: '150.150.2.1',
        ipv6_address: 'e80::1ff:fe23:4567:890a',
      },
      {
        id: 3,
        node_id: 1,
        ipv4_address: '150.150.2.2',
        ipv6_address: 'e80::1ff:fe23:4567:890b',
      },
    ],
  }
};

export const emptyTopology = {
  topology: {
    nodes: [],
    links: [],
    interfaces: [],
  }
};

export const multipleInterfaces = {
  topology: {
    nodes: [
      {
        id: 1,
        name: 'router',
        physical_role: 'router',
        router: true,
      },
      {
        id: 2,
        name: 'pc',
        physical_role: 'desktop',
        router: false,
      }
    ],
    links: [
      {
        id: 5,
        source_interface_id: 3,
        target_interface_id: 4,
        between_routers: false,
      },
      {
        id: 6,
        source_interface_id: 4,
        target_interface_id: 3,
        between_routers: false,
      }
    ],
    interfaces: [
      {
        id: 4,
        node_id: 2,
        ipv4_address: '150.150.2.1',
        ipv6_address: 'e80::1ff:fe23:4567:890a',
      },
      {
        id: 3,
        node_id: 1,
        ipv4_address: '150.150.2.2',
        ipv6_address: 'e80::1ff:fe23:4567:890b',
      },
      {
        id: 44,
        node_id: 2,
        ipv4_address: '150.150.2.11',
        ipv6_address: 'e80::1ff:fe23:4567:891a',
      },
      {
        id: 33,
        node_id: 1,
        ipv4_address: '150.150.2.22',
        ipv6_address: 'e80::1ff:fe23:4567:891b',
      },
    ],
  }
};
