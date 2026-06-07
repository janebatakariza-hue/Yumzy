import type { Review } from "../types";

export const reviews: Review[] = [
  { id: "1", clientName: "Emma Johnson",  restaurantId: "1", restaurantName: "Soy Restaurant", rating: 5, comment: "Amazing food and great service! Will definitely come back.",         status: "PUBLISHED", createdAt: "2024-01-10" },
  { id: "2", clientName: "Michael Brown", restaurantId: "2", restaurantName: "M Hotel & Spa",  rating: 4, comment: "Very good experience, the ambiance was perfect.",                   status: "PUBLISHED", createdAt: "2024-01-09" },
  { id: "3", clientName: "Sophia Davis",  restaurantId: "3", restaurantName: "Sundowner",      rating: 2, comment: "Service was too slow and food was cold when it arrived.",           status: "PENDING",   createdAt: "2024-01-08" },
  { id: "4", clientName: "James Okonkwo", restaurantId: "1", restaurantName: "Soy Restaurant", rating: 5, comment: "Best African fusion I have ever had. Highly recommended!",          status: "PUBLISHED", createdAt: "2024-01-07" },
  { id: "5", clientName: "Aisha Nkosi",   restaurantId: "4", restaurantName: "Aroma Cafe",     rating: 4, comment: "Lovely cafe with great coffee and pastries.",                       status: "PUBLISHED", createdAt: "2024-01-06" },
  { id: "6", clientName: "Peter Mugabo",  restaurantId: "2", restaurantName: "M Hotel & Spa",  rating: 1, comment: "Terrible experience, food was undercooked and staff was rude.",     status: "PENDING",   createdAt: "2024-01-05" },
];