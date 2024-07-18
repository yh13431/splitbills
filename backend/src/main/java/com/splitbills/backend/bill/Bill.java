package com.splitbills.backend.bill;

import jakarta.persistence.*;

@Entity
@Table(name = "bills")
public class Bill {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column(name = "name")
  private String name;

  @Column(name = "price")
  private Long price;

  @Column(name = "quantity")
  private Long quantity;

  //getters and setters

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Long getPrice() {
    return price;
  }

  public void setPrice(Long price) {
    this.price = price;
  }

  public Long getQuantity() {
    return price;
  }

  public void setQuantity(Long quantity) {
    this.quantity = quantity;
  }
}