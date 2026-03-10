import heapq

def get_shortest_paths(graph, start_node):
    distances = {node: float('inf') for node in graph}
    distances[start_node] = 0.0
    pq = [(0.0, start_node)]

    while pq:
        current_dist, u = heapq.heappop(pq)

        if current_dist > distances[u]:
            continue

        for v, weight in graph[u].items():
            new_dist = current_dist + weight

            if new_dist < distances[v]:
                distances[v] = new_dist
                heapq.heappush(pq, (new_dist, v))

    rounded_distances = {
        n: round(d, 2) if d != float('inf') else d
        for n, d in distances.items()
    }

    total_sum = sum(
        d for n, d in rounded_distances.items()
        if n != start_node and d != float('inf')
    )

    return rounded_distances, round(total_sum, 2)


# --- Graphs ---

graph_1 = {
    1: {2: 10, 6: 10},
    2: {6: 10, 3: 12, 5: 12, 1:10},
    3: {6: 10, 5: 12, 4: 12, 2: 12},
    4: {3: 12, 5: 14},
    5: {6: 10, 4: 14, 3: 12, 2: 12},
    6: {1: 10, 2: 10, 5: 10, 3: 10}
}

graph_2 = {
    1: {2: 15, 6: 15},
    2: {6: 15, 3: 25, 5: 25, 1: 15},
    3: {6: 25, 5: 25, 4: 25, 2: 25},
    4: {3: 25, 5: 25},
    5: {6: 25, 4: 25, 3: 25, 2: 25},
    6: {1: 15, 2: 15, 5: 25, 3: 25}
}

graph_3 = {
    1: {2: 1.2, 6: 1.2},
    2: {6: 1.2, 3: 1.5, 5: 1.5, 1: 1.2},
    3: {6: 1.3, 5: 1.5, 4: 1.5, 2: 1.5},
    4: {3: 1.5, 5: 1.2},
    5: {6: 1.5, 4: 1.2, 3: 1.5, 2: 1.5},
    6: {1: 1.2, 2: 1.2, 5: 1.5, 3: 1.3}
}

graphs = [graph_1, graph_2, graph_3]


for i, g in enumerate(graphs, 1):

    print(f"\n===== Graph {i} =====")

    best_node = None
    best_total = float('inf')

    for node in g:

        dist_map, total = get_shortest_paths(g, node)

        print(f"\nStart Node: {node}")
        print(f"Distances: {dist_map}")
        print(f"Total Distance: {total}")

        if total < best_total:
            best_total = total
            best_node = node

    print("\n*** Shortest Overall Node ***")
    print(f"Node: {best_node}")
    print(f"Minimum Total Distance: {best_total}")