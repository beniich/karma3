import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 }, // Ramp up to 10 users over 10s
    { duration: '20s', target: 30 }, // Stress it at 30 users over 20s
    { duration: '10s', target: 0 },  // Ramp down to 0 users over 10s
  ],
};

export default function () {
  const url = 'http://localhost:3000/api/ai/generate';
  const payload = JSON.stringify({
    userId: 'stress_test_virtual_user_' + Math.floor(Math.random() * 1000),
    prompt: 'Execute professional audit diagnostic for active Sovereign Node. Identify drift anomalies and compile gap mapping evidence.',
    systemInstruction: 'You are AuditAX Sovereign Intelligence. Perform extreme risk assessments.'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'X-Correlation-ID': 'k6-stress-vuser-' + __VU + '-iter-' + __ITER
    },
  };

  const res = http.post(url, payload, params);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 250ms': (r) => r.timings.duration < 250,
  });

  sleep(1); // Sleep for 1s between iterations
}
