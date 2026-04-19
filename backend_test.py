import requests
import sys
import os
from datetime import datetime
import json

class EcommerceAPITester:
    def __init__(self, base_url=None):
        if base_url is None:
            base_url = os.getenv("BACKEND_TEST_BASE_URL", "http://localhost:8001")
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, expected_fields=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}" if not endpoint.startswith('/') else f"{self.base_url}{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                # Validate response structure if expected_fields provided
                if expected_fields and response.status_code == 200:
                    try:
                        response_data = response.json()
                        if isinstance(response_data, list) and len(response_data) > 0:
                            response_data = response_data[0]  # Check first item for lists
                        
                        for field in expected_fields:
                            if field not in response_data:
                                print(f"⚠️  Warning: Expected field '{field}' not found in response")
                            else:
                                print(f"   ✓ Field '{field}' present")
                    except Exception as e:
                        print(f"   ⚠️  Could not validate response structure: {e}")
                
                return True, response.json() if response.content else {}
            else:
                self.tests_passed += 1 if response.status_code == expected_status else 0
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                if response.content:
                    try:
                        error_data = response.json()
                        print(f"   Error: {error_data}")
                    except:
                        print(f"   Error: {response.text}")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'url': url
                })
                return False, {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout")
            self.failed_tests.append({'name': name, 'error': 'Timeout', 'url': url})
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({'name': name, 'error': str(e), 'url': url})
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200, expected_fields=["message"])

    def test_dashboard_kpis(self):
        """Test dashboard KPIs endpoint"""
        expected_fields = ["total_revenue", "total_orders", "total_customers", "avg_order_value", 
                          "revenue_growth", "orders_growth", "customers_growth"]
        return self.run_test("Dashboard KPIs", "GET", "dashboard/kpis", 200, expected_fields=expected_fields)

    def test_dashboard_revenue(self):
        """Test revenue data endpoint"""
        expected_fields = ["month", "revenue", "orders"]
        return self.run_test("Revenue Data", "GET", "dashboard/revenue", 200, expected_fields=expected_fields)

    def test_dashboard_products(self):
        """Test products data endpoint"""
        expected_fields = ["category", "sales", "revenue"]
        return self.run_test("Products Data", "GET", "dashboard/products", 200, expected_fields=expected_fields)

    def test_dashboard_states(self):
        """Test states data endpoint"""
        expected_fields = ["state", "state_name", "sales", "revenue", "customers"]
        return self.run_test("States Data", "GET", "dashboard/states", 200, expected_fields=expected_fields)
    
    def test_dashboard_payments(self):
        """Test payments data endpoint"""
        expected_fields = ["payment_type", "count", "total_value", "percentage"]
        return self.run_test("Payments Data", "GET", "dashboard/payments", 200, expected_fields=expected_fields)

    def test_dashboard_segments(self):
        """Test customer segments endpoint"""
        expected_fields = ["segment", "count", "percentage"]
        return self.run_test("Customer Segments", "GET", "dashboard/segments", 200, expected_fields=expected_fields)

    def test_insights(self):
        """Test insights endpoint"""
        expected_fields = ["id", "title", "description", "recommendation", "category", "impact"]
        return self.run_test("Business Insights", "GET", "insights", 200, expected_fields=expected_fields)

    def test_chat_functionality(self):
        """Test assistant chat endpoint with different prompts"""
        test_cases = [
            {"message": "What are the top selling products?", "expected_keyword": "bed_bath_table"},
            {"message": "Tell me about revenue", "expected_keyword": "R$13,591,643"},
            {"message": "Who are our best customers?", "expected_keyword": "Champions"},
            {"message": "Random question", "expected_keyword": "Olist"}
        ]
        
        all_passed = True
        for i, test_case in enumerate(test_cases):
            success, response = self.run_test(
                f"Chat Test {i+1}: {test_case['message'][:30]}...", 
                "POST", 
                "chat", 
                200, 
                data={"message": test_case["message"]},
                expected_fields=["response"]
            )
            
            if success and "response" in response:
                if test_case["expected_keyword"].lower() in response["response"].lower():
                    print(f"   ✓ Response contains expected keyword: '{test_case['expected_keyword']}'")
                else:
                    print(f"   ⚠️  Response doesn't contain expected keyword: '{test_case['expected_keyword']}'")
                    print(f"   Response: {response['response'][:100]}...")
            else:
                all_passed = False
        
        return all_passed

    def test_export_endpoints(self):
        """Test CSV export endpoints"""
        success1 = self.run_test("Export Dashboard CSV", "GET", "export/dashboard/csv", 200)[0]
        success2 = self.run_test("Export Insights CSV", "GET", "export/insights/csv", 200)[0]
        return success1 and success2

    def test_status_endpoints(self):
        """Test status check endpoints"""
        # Test POST status
        test_data = {"client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"}
        success, response = self.run_test(
            "Create Status Check", 
            "POST", 
            "status", 
            200, 
            data=test_data,
            expected_fields=["id", "client_name", "timestamp"]
        )
        
        if success:
            # Test GET status
            self.run_test("Get Status Checks", "GET", "status", 200)
        
        return success

def main():
    print("🚀 Starting E-commerce Intelligence API Tests")
    print("=" * 60)
    
    # Setup
    tester = EcommerceAPITester()
    
    # Run all tests
    print("\n📊 Testing Dashboard Endpoints...")
    tester.test_root_endpoint()
    tester.test_dashboard_kpis()
    tester.test_dashboard_revenue()
    tester.test_dashboard_products()
    tester.test_dashboard_states()
    tester.test_dashboard_segments()
    tester.test_dashboard_payments()
    
    print("\n💡 Testing Insights Endpoint...")
    tester.test_insights()
    
    print("\n📤 Testing Export Endpoints...")
    tester.test_export_endpoints()
    
    print("\n💬 Testing Assistant Chat Functionality...")
    tester.test_chat_functionality()
    
    print("\n📋 Testing Status Endpoints...")
    tester.test_status_endpoints()
    
    # Print results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print(f"\n❌ Failed Tests ({len(tester.failed_tests)}):")
        for test in tester.failed_tests:
            error_msg = test.get('error', f"Expected {test.get('expected')}, got {test.get('actual')}")
            print(f"   • {test['name']}: {error_msg}")
    else:
        print("\n✅ All tests passed!")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"📈 Success Rate: {success_rate:.1f}%")
    
    return 0 if success_rate >= 80 else 1

if __name__ == "__main__":
    sys.exit(main())