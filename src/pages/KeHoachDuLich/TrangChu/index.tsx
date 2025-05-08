import React, { useEffect, useState } from "react";
import { Row, Col, Spin, Select, Slider, Radio, Card, Space, Divider } from "antd";
import { SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import DestinationCard from "./components/DestinationCard";
import { fetchDestinations } from "../../../services/KeHoachDuLich/TrangChu/api"; 
import { Destination, DestinationType } from "../../../services/KeHoachDuLich/TrangChu/types";

const { Option } = Select;

const HomePage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Filter states
  const [selectedTypes, setSelectedTypes] = useState<DestinationType[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("none");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await fetchDestinations();
        setDestinations(data);
        setFilteredDestinations(data);
        
        // Initialize price range based on data
        if (data.length > 0) {
          const minPrice = Math.min(...data.map(d => getTotalCost(d)));
          const maxPrice = Math.max(...data.map(d => getTotalCost(d)));
          setPriceRange([minPrice, maxPrice]);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu điểm đến", error);
      } finally {
        setLoading(false);
      }
    };

    loadDestinations();
  }, []);

  // Helper function to calculate total cost
  const getTotalCost = (destination: Destination): number => {
    return destination.cost.food + destination.cost.transport + destination.cost.accommodation;
  };

  // Apply filters whenever filter criteria change
  useEffect(() => {
    filterAndSortDestinations();
  }, [selectedTypes, priceRange, minRating, sortBy, sortOrder, destinations]);

  const filterAndSortDestinations = () => {
    let filtered = [...destinations];

    // Filter by destination type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(dest => selectedTypes.includes(dest.type));
    }

    // Filter by price range
    filtered = filtered.filter(dest => {
      const totalCost = getTotalCost(dest);
      return totalCost >= priceRange[0] && totalCost <= priceRange[1];
    });

    // Filter by minimum rating
    filtered = filtered.filter(dest => dest.rating >= minRating);

    // Sort
    if (sortBy !== "none") {
      filtered.sort((a, b) => {
        let valueA, valueB;
        
        if (sortBy === "name") {
          valueA = a.name;
          valueB = b.name;
          return sortOrder === "asc" 
            ? valueA.localeCompare(valueB) 
            : valueB.localeCompare(valueA);
        } else if (sortBy === "rating") {
          valueA = a.rating;
          valueB = b.rating;
        } else if (sortBy === "price") {
          valueA = getTotalCost(a);
          valueB = getTotalCost(b);
        }
        
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      });
    }

    setFilteredDestinations(filtered);
  };

  const handleTypeChange = (values: DestinationType[]) => {
    setSelectedTypes(values);
  };

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
  };

  const handleRatingChange = (value: number) => {
    setMinRating(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  // Format price for display
  const formatPrice = (value: number): string => {
    return `${value.toLocaleString()} VND`;
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  // Find min and max prices for the slider
  const minPrice = Math.min(...destinations.map(d => getTotalCost(d)));
  const maxPrice = Math.max(...destinations.map(d => getTotalCost(d)));

  return (
    <div style={{ padding: "20px" }}>
      <h2>Khám phá điểm đến</h2>
      
      <Card style={{ marginBottom: 20 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <h3>Bộ lọc</h3>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <div>
                <h4>Loại hình</h4>
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Chọn loại hình"
                  onChange={handleTypeChange}
                >
                  <Option value="biển">Biển</Option>
                  <Option value="núi">Núi</Option>
                  <Option value="thành phố">Thành phố</Option>
                </Select>
              </div>
            </Col>
            
            <Col xs={24} md={8}>
              <div>
                <h4>Tổng chi phí: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</h4>
                <Slider
                  range
                  min={minPrice}
                  max={maxPrice}
                  step={100000}
                  value={priceRange}
                  onChange={handlePriceChange}
                  tooltip={{ formatter: formatPrice }}
                />
              </div>
            </Col>
            
            <Col xs={24} md={4}>
              <div>
                <h4>Đánh giá tối thiểu: {minRating}</h4>
                <Slider
                  min={0}
                  max={5}
                  step={0.5}
                  value={minRating}
                  onChange={handleRatingChange}
                />
              </div>
            </Col>
            
            <Col xs={24} md={6}>
              <div>
                <h4>Sắp xếp theo</h4>
                <Space>
                  <Select
                    style={{ width: 140 }}
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    <Option value="none">Mặc định</Option>
                    <Option value="name">Tên</Option>
                    <Option value="rating">Đánh giá</Option>
                    <Option value="price">Giá</Option>
                  </Select>
                  {sortBy !== "none" && (
                    <Radio.Button onClick={toggleSortOrder}>
                      {sortOrder === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
                    </Radio.Button>
                  )}
                </Space>
              </div>
            </Col>
          </Row>
        </Space>
      </Card>
      
      <Divider />
      
      <div style={{ marginBottom: 16 }}>
        Hiển thị {filteredDestinations.length} / {destinations.length} điểm đến
      </div>
      
      <Row gutter={[16, 16]}>
        {filteredDestinations.length > 0 ? (
          filteredDestinations.map((destination) => (
            <Col key={destination.id} xs={24} sm={12} md={8} lg={6}>
              <DestinationCard destination={destination} />
            </Col>
          ))
        ) : (
          <Col span={24}>
            <div style={{ textAlign: "center", padding: "20px" }}>
              Không tìm thấy điểm đến phù hợp với bộ lọc. Vui lòng thử lại với tiêu chí khác.
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default HomePage;