import http from 'k6/http';
import { check } from 'k6';

// Load test for the Login endpoint (POST /login).
//
// Context:
//  - Threshold: p(95) < 500ms (Context 2.3)
//  - Stages (Context 2.4):
//      * ramp to 10 VUs over the first 5s
//      * ramp to 30 VUs over the next 20s
//      * ramp down to 0 VUs over the final 5s
//  - Test data from README.md (Rule 3.2)

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '5s', target: 10 },  // 10 users in the first 5s
    { duration: '20s', target: 30 }, // 30 users in the next 20s
    { duration: '5s', target: 0 },   // 0 users after 5s
  ],
  thresholds: {
    // 95th percentile of request duration must stay under 500ms
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const url = `${BASE_URL}/login`;

  // Valid login credentials from README.md (seeded user "John Doe")
  const payload = JSON.stringify({
    email: 'john@example.com',
    password: 'password123',
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(url, payload, params);

  // Assertions based on the Swagger /login 200 response
  check(res, {
    'status is 200': (r) => r.status === 200,
    'login successful message': (r) => r.json('message') === 'Login successful.',
    'JWT token is returned': (r) => typeof r.json('token') === 'string' && r.json('token').length > 0,
  });
}
